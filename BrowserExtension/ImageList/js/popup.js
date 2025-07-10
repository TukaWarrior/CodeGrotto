// ==========================
// popup.js
// ==========================
import { app } from './core/app.js';
import { registry } from './core/registry.js';
import { ImageModule } from './modules/images/module.js';

// Register all modules
registry.registerModule('images', new ImageModule());

// Future modules can be added here:
// registry.registerModule('links', new LinkModule());
// registry.registerModule('videos', new VideoModule());

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  app.initialize();
});
