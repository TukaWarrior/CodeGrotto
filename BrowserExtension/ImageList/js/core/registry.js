// registry.js - Module registry for content grabbers and renderers
export class ModuleRegistry {
  constructor() {
    this.modules = new Map();
    this.activeModuleId = null;
  }

  registerModule(moduleId, module) {
    if (this.modules.has(moduleId)) {
      console.warn(`Module ${moduleId} already registered`);
      return false;
    }
    this.modules.set(moduleId, module);
    console.log(`Module ${moduleId} registered`);
    return true;
  }

  getModule(moduleId) {
    return this.modules.get(moduleId);
  }

  getAllModules() {
    return Array.from(this.modules.values());
  }

  setActiveModule(moduleId) {
    if (!this.modules.has(moduleId)) {
      console.error(`Cannot activate module ${moduleId}: not registered`);
      return false;
    }
    this.activeModuleId = moduleId;
    return true;
  }

  getActiveModule() {
    return this.modules.get(this.activeModuleId);
  }
}

// Singleton instance
export const registry = new ModuleRegistry();