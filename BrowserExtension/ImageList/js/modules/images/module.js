// module.js - Image module that integrates grabber, store, and renderer
import { ModuleBase } from '../module-base.js';
import { imageStore } from './store.js';
import { imageGrabber } from './grabber.js';
import { imageRenderer } from './renderer.js';
import { eventBus, Events } from '../../core/events.js';

export class ImageModule extends ModuleBase {
  constructor() {
    super('images', 'Images');
    this.store = imageStore;
    this.grabber = imageGrabber;
    this.renderer = imageRenderer;
  }
  
  async initialize() {
    // Initialize components
    await this.grabber.initialize();
    
    // Setup message listener for content script responses
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'newImages') {
        this.grabber.handleNewImages(message.images);
      }
    });
    
    // Notify that we're initialized
    super.initialize();
  }
  
  initializeUI(container) {
    super.initializeUI(container);
    this.renderer.initialize(container);
  }
  
  grab() {
    this.grabber.grab();
  }
  
  onSettingsChanged(settings) {
    this.grabber.updateRefreshInterval(settings);
  }
}