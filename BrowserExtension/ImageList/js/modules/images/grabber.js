// grabber.js - Collects images from the current page
import { imageStore } from './store.js';
import { eventBus, Events } from '../../core/events.js';
import { getAllSettings } from '../settings/settings-store.js';

export class ImageGrabber {
  constructor() {
    this.refreshInterval = null;
  }
  
  initialize() {
    // Listen for settings changes
    eventBus.subscribe(Events.SETTINGS_CHANGED, (settings) => {
      this.updateRefreshInterval(settings);
    });
  }
  
  updateRefreshInterval(settings) {
    // Clear existing interval if any
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
    
    // Set up new interval if auto mode is enabled
    if (settings && settings.refreshMode === 'auto') {
      const interval = settings.refreshInterval || 1000;
      this.refreshInterval = setInterval(() => this.grab(), interval);
    }
  }
  
  grab() {
    console.log("Grabbing images...");
    eventBus.publish(Events.GRABBER_START, { type: 'image' });
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].id) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ['js/modules/images/content-script.js']
        });
      }
    });
  }
  
  handleNewImages(images) {
    const timestamp = Date.now();
    
    // Group images by their base URL
    const imageGroups = {};
    
    images.forEach(src => {
      // Filter out tracking pixels and small images
      if (this.shouldFilterImage(src)) {
        return;
      }
      
      // Find the file extension position
      const extensionMatch = src.match(/\.(jpe?g|png|gif|webp|svg|bmp|ico|avif)(\?|$)/i);
      if (!extensionMatch) {
        // No recognized extension, treat as unique image
        this.addNewImage(src, timestamp);
        return;
      }
      
      // Extract base URL up to and including extension
      const extensionPos = extensionMatch.index + extensionMatch[0].length - (extensionMatch[2] === '?' ? 1 : 0);
      const baseUrl = src.substring(0, extensionPos);
      
      // Store only the base URL without parameters
      if (!imageGroups[baseUrl]) {
        imageGroups[baseUrl] = baseUrl;
      }
    });
    
    // Process each base URL
    Object.keys(imageGroups).forEach(baseUrl => {
      // Check if already exists or pending
      if (!imageStore.isImageExists(baseUrl) && !imageStore.isImagePending(baseUrl)) {
        this.addNewImage(baseUrl, timestamp);
      }
    });
  }
  
  shouldFilterImage(src) {
    return src.includes('pixel') || 
      src.includes('tracker') || 
      src.includes('beacon') ||
      src.includes('analytics') ||
      src.includes('tracking') ||
      src.includes('px.gif') ||
      src.includes('spacer') ||
      src.includes('telemetry') ||
      src.match(/\/[0-9]+x[0-9]+\.(gif|png)/) ||
      src.includes('counter.') ||
      src.includes('metrics.') ||
      src.includes('stat.') ||
      src.startsWith('data:image') ||
      src.length < 20;
  }
  
  addNewImage(src, timestamp) {
    // Mark as pending
    imageStore.markImageAsPending(src, timestamp);
    
    // Get resolution data
    const img = new Image();
    
    // Set a timeout to clean up stalled loading images
    const loadTimeout = setTimeout(() => {
      imageStore.removeFromPending(src);
    }, 5000);
    
    img.onload = () => {
      clearTimeout(loadTimeout);
      
      // Filter out small images
      if (img.naturalWidth <= 5 || img.naturalHeight <= 5) {
        imageStore.removeFromPending(src);
        return;
      }
      
      // Add to image store
      const newImage = {
        src,
        timestamp,
        order: imageStore.getAllImages().length,
        width: img.naturalWidth,
        height: img.naturalHeight,
        resolution: img.naturalWidth * img.naturalHeight,
        loaded: true
      };
      
      imageStore.removeFromPending(src);
      imageStore.addImage(newImage);
      
      // Notify that content was updated
      eventBus.publish(Events.CONTENT_UPDATED, { type: 'image' });
    };
    
    img.onerror = () => {
      clearTimeout(loadTimeout);
      imageStore.removeFromPending(src);
    };
    
    img.src = src;
  }
  
  cleanup() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }
}

// Export singleton instance
export const imageGrabber = new ImageGrabber();