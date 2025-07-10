// settings.js - Settings UI management
import { loadSettings, saveSettings, getAllSettings } from './settings-store.js';

// Global reference to refresh interval handler
let refreshIntervalId = null;

export async function initializeSettings() {
  const settingsBtn = document.getElementById('settingsBtn');
  if (!settingsBtn) return;
  
  // Load settings first
  await loadSettings();
  
  settingsBtn.addEventListener('click', showSettingsPanel);
}

export function getRefreshInterval() {
  return getAllSettings().refreshInterval;
}

export function updateRefreshInterval(interval, callback) {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId);
  }
  
  if (typeof callback === 'function' && interval > 0) {
    refreshIntervalId = setInterval(callback, interval);
  }
  
  return refreshIntervalId;
}

function showSettingsPanel() {
  const existingPanel = document.getElementById('settingsPanel');
  if (existingPanel) return;
  
  const panel = document.createElement('div');
  panel.id = 'settingsPanel';
  panel.className = 'settings-panel';
  
  // Header
  const header = document.createElement('div');
  header.className = 'settings-header';
  
  const title = document.createElement('h2');
  title.textContent = 'Settings';
  title.className = 'settings-title';
  
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '&times;';
  closeBtn.className = 'settings-close';
  closeBtn.onclick = () => document.body.removeChild(panel);
  
  header.appendChild(title);
  header.appendChild(closeBtn);
  panel.appendChild(header);
  
  // Settings content
  const content = document.createElement('div');
  
  // Get current settings
  const settings = getAllSettings();
  
  // Auto-refresh setting
  const refreshDiv = document.createElement('div');
  refreshDiv.className = 'settings-group';
  
  const refreshLabel = document.createElement('label');
  refreshLabel.textContent = 'Auto-refresh interval (ms): ';
  refreshLabel.setAttribute('for', 'refreshInterval');
  
  const refreshInput = document.createElement('input');
  refreshInput.type = 'number';
  refreshInput.id = 'refreshInterval';
  refreshInput.className = 'settings-input';
  refreshInput.min = '500';
  refreshInput.max = '5000';
  refreshInput.step = '500';
  refreshInput.value = settings.refreshInterval;
  
  refreshDiv.appendChild(refreshLabel);
  refreshDiv.appendChild(refreshInput);
  content.appendChild(refreshDiv);
  
  // Save button
  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save Settings';
  saveBtn.className = 'settings-save';
  saveBtn.onclick = async () => {
    // Get values from inputs
    const newRefreshInterval = parseInt(refreshInput.value, 10);
    
    // Save to storage
    await saveSettings({
      refreshInterval: newRefreshInterval
    });
    
    // Apply settings
    const event = new CustomEvent('settingsChanged', { 
      detail: { refreshInterval: newRefreshInterval } 
    });
    document.dispatchEvent(event);
    
    // Close panel
    document.body.removeChild(panel);
  };
  
  content.appendChild(saveBtn);
  panel.appendChild(content);
  
  document.body.appendChild(panel);
}