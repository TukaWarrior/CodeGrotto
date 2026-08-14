// events.js - Simple event bus for inter-module communication
export class EventBus {
  constructor() {
    this.subscribers = {};
  }

  subscribe(event, callback) {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }
    this.subscribers[event].push(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers[event] = this.subscribers[event].filter(cb => cb !== callback);
    };
  }

  publish(event, data) {
    if (!this.subscribers[event]) return;
    this.subscribers[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event subscriber for ${event}:`, error);
      }
    });
  }
}

// Singleton instance
export const eventBus = new EventBus();

// Common event types
export const Events = {
  CONTENT_UPDATED: 'content-updated',
  SETTINGS_CHANGED: 'settings-changed',
  TAB_CHANGED: 'tab-changed',
  GRABBER_START: 'grabber-start',
  GRABBER_COMPLETE: 'grabber-complete'
};