// settings-store.js
const DEFAULT_SETTINGS = {
  refreshInterval: 1000,     // milliseconds
  refreshMode: 'manual',     // 'manual' or 'auto'
  minImageSize: 1,           // filter out images smaller than this
  sortCriterion: 'timestamp', // What to sort by
  sortDirection: 'asc',      // Sort direction (asc/desc)
  autoDownload: false,       // future feature
  darkMode: false            // future feature
};

// Cache for the current settings
let currentSettings = {...DEFAULT_SETTINGS};

// Load settings from chrome.storage.local
export async function loadSettings() {
  return new Promise(resolve => {
    chrome.storage.local.get('settings', (result) => {
      if (result.settings) {
        currentSettings = {...DEFAULT_SETTINGS, ...result.settings};
      }
      resolve(currentSettings);
    });
  });
}

// Save settings to chrome.storage.local
export async function saveSettings(newSettings) {
  currentSettings = {...currentSettings, ...newSettings};
  
  return new Promise(resolve => {
    chrome.storage.local.set({settings: currentSettings}, () => {
      resolve(currentSettings);
    });
  });
}

// Get a specific setting
export function getSetting(key) {
  return currentSettings[key];
}

// Get all settings
export function getAllSettings() {
  return {...currentSettings};
}