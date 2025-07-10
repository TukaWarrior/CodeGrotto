// module-base.js - Base class for content modules
import { eventBus } from '../core/events.js';

export class ModuleBase {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.data = [];
    this.container = null;
    this.initialized = false;
  }
  
  async initialize() {
    // To be implemented by subclasses
    this.initialized = true;
  }
  
  initializeUI(container) {
    this.container = container;
    // To be implemented by subclasses
  }
  
  async grab() {
    // To be implemented by subclasses
  }
  
  onSettingsChanged(settings) {
    // To be implemented by subclasses
  }
  
  render() {
    // To be implemented by subclasses
  }
}