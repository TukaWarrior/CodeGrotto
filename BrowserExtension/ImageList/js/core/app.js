// app.js - Main application controller
import { registry } from './registry.js';
import { eventBus, Events } from './events.js';
import { initializeSettings } from '../modules/settings/settings-ui.js';

export class App {
  constructor() {
    this.initialized = false;
    this.tabButtons = new Map();
  }
  
  async initialize() {
    if (this.initialized) return;
    
    // Initialize settings
    await initializeSettings();
    
    // Create tabs for each module
    this.createModuleTabs();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Initialize all modules
    const modules = registry.getAllModules();
    for (const module of modules) {
      await module.initialize();
    }
    
    this.initialized = true;
    
    // Activate first module by default if available
    const firstModule = modules[0];
    if (firstModule) {
      this.activateModule(firstModule.id);
    }
  }
  
  createModuleTabs() {
    const tabBar = document.createElement('div');
    tabBar.className = 'tab-bar';
    
    const modules = registry.getAllModules();
    modules.forEach(module => {
      const tab = document.createElement('button');
      tab.className = 'tab';
      tab.textContent = module.name;
      tab.dataset.moduleId = module.id;
      
      tab.addEventListener('click', () => {
        this.activateModule(module.id);
      });
      
      tabBar.appendChild(tab);
      this.tabButtons.set(module.id, tab);
    });
    
    // Insert tab bar before the main content
    const main = document.querySelector('main');
    if (main) {
      main.parentElement.insertBefore(tabBar, main);
    }
    
    // Create tab panes container if needed
    if (!document.getElementById('tab-content')) {
      const tabContent = document.createElement('div');
      tabContent.id = 'tab-content';
      main.appendChild(tabContent);
    }
  }
  
  activateModule(moduleId) {
    // Update active tab styling
    this.tabButtons.forEach((button, id) => {
      if (id === moduleId) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
    
    // Set active module
    registry.setActiveModule(moduleId);
    
    // Clear tab content
    const tabContent = document.getElementById('tab-content');
    tabContent.innerHTML = '';
    
    // Get active module and render its content
    const module = registry.getModule(moduleId);
    if (module) {
      // Create container for this module
      const moduleContainer = document.createElement('div');
      moduleContainer.id = `${moduleId}-container`;
      moduleContainer.className = 'module-container';
      tabContent.appendChild(moduleContainer);
      
      // Initialize UI
      module.initializeUI(moduleContainer);
      
      // Run grabber
      module.grab();
      
      // Show sort controls for image module
      const sortControls = document.querySelector('.sort-controls');
      if (sortControls) {
        if (moduleId === 'images') {
          sortControls.style.display = 'block';
        } else {
          sortControls.style.display = 'none';
        }
      }
      
      // Notify about tab change
      eventBus.publish(Events.TAB_CHANGED, { moduleId });
    }
  }
  
  setupEventListeners() {
    // Handle settings changes
    eventBus.subscribe(Events.SETTINGS_CHANGED, (settings) => {
      // Update all modules with new settings
      registry.getAllModules().forEach(module => {
        module.onSettingsChanged(settings);
      });
    });
  }
}

export const app = new App();