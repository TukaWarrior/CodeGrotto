// ==========================
// popup.js
// ==========================
import { renderImageList } from './renderer.js';
import { initializeSettings, getRefreshInterval, updateRefreshInterval } from './settings.js';

// We need to define getAllSettings if it's not exported from settings.js
function getAllSettings() {
  // Return default settings if not available from settings.js
  return {
    refreshInterval: getRefreshInterval(),
    refreshMode: 'manual'
  };
}

// Track images with metadata
let imageData = [];
let currentSortMethod = 'oldest';
let refreshInterval = null;
let pendingImages = new Map(); // Track images that are currently loading

function injectImageGrabber() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && tabs[0].id) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['js/grabber-images.js']
      });
    }
  });
}

function addNewImage(src, timestamp) {
  // Enhanced filtering for known tracking patterns and temporary images
  if (
    // URL-based filtering
    src.includes('pixel') || 
    src.includes('tracker') || 
    src.includes('beacon') ||
    src.includes('analytics') ||
    src.includes('tracking') ||
    src.includes('px.gif') ||
    src.includes('spacer') ||
    src.includes('telemetry') ||
    src.match(/\/[0-9]+x[0-9]+\.(gif|png)/) || // Common dimension patterns like 1x1.gif
    
    // Suspicious domains
    src.includes('counter.') ||
    src.includes('metrics.') ||
    src.includes('stat.') ||
    
    // Data URIs (often used for tiny tracking images)
    src.startsWith('data:image') ||
    
    // Very short URLs are often tracking pixels
    src.length < 20
  ) {
    return;
  }
  
  // Check if this image is already in our tracking map
  if (pendingImages.has(src)) {
    return; // Already processing this image
  }
  
  // Check if image already exists in our data
  const existingIndex = imageData.findIndex(img => img.src === src);
  if (existingIndex !== -1) {
    return; // Already have this image
  }
  
  // Create a placeholder and track it
  pendingImages.set(src, {
    timestamp,
    loading: true
  });
  
  // Get resolution data
  const img = new Image();
  
  // Set a timeout to clean up stalled loading images
  const loadTimeout = setTimeout(() => {
    // Clean up if still pending
    if (pendingImages.has(src)) {
      pendingImages.delete(src);
    }
  }, 5000);
  
  img.onload = () => {
    clearTimeout(loadTimeout);
    
    // Enhanced filtering - filter out small images that are likely tracking pixels
    if (img.naturalWidth <= 5 || img.naturalHeight <= 5) {
      pendingImages.delete(src);
      return;
    }
    
    // Only now add it to the actual image data
    const newImage = {
      src,
      timestamp,
      order: imageData.length,
      width: img.naturalWidth,
      height: img.naturalHeight,
      resolution: img.naturalWidth * img.naturalHeight,
      loaded: true
    };
    
    // Remove from pending and add to actual data
    pendingImages.delete(src);
    imageData.push(newImage);
    
    // Update display
    sortAndRenderImages();
  };
  
  img.onerror = () => {
    clearTimeout(loadTimeout);
    pendingImages.delete(src);
  };
  
  img.src = src;
}

function handleNewImages(images) {
  const timestamp = Date.now();
  
  // Group images by their base URL (everything up to and including file extension)
  const imageGroups = {};
  
  images.forEach(src => {
    // Find the file extension position
    const extensionMatch = src.match(/\.(jpe?g|png|gif|webp|svg|bmp|ico|avif)(\?|$)/i);
    if (!extensionMatch) {
      // No recognized extension, treat as unique image
      addNewImage(src, timestamp);
      return;
    }
    
    // Extract base URL up to and including extension - this gives us the original image without params
    const extensionPos = extensionMatch.index + extensionMatch[0].length - (extensionMatch[2] === '?' ? 1 : 0);
    const baseUrl = src.substring(0, extensionPos);
    
    // Instead of keeping all variants, we'll just use the base URL directly
    if (!imageGroups[baseUrl]) {
      imageGroups[baseUrl] = baseUrl; // Store only the base URL without parameters
    }
  });
  
  // Process each base URL - they're already stripped of parameters
  Object.keys(imageGroups).forEach(baseUrl => {
    // Check if we already have this base URL in our data
    const existingIndex = imageData.findIndex(img => 
      img.src === baseUrl || (img.src.startsWith(baseUrl) && 
        (img.src.length === baseUrl.length || img.src.charAt(baseUrl.length) === '?' || 
         img.src.charAt(baseUrl.length) === '#'))
    );
    
    // Check if we're already loading this URL
    const isPending = pendingImages.has(baseUrl);
    
    if (existingIndex === -1 && !isPending) {
      // New image that's not pending, add it
      addNewImage(baseUrl, timestamp);
    }
  });
}

function sortAndRenderImages() {
  let sortedImages = [...imageData];
  
  switch (currentSortMethod) {
    case 'newest':
      sortedImages.sort((a, b) => b.timestamp - a.timestamp || b.order - a.order);
      break;
    case 'oldest':
      sortedImages.sort((a, b) => a.timestamp - b.timestamp || a.order - b.order);
      break;
    case 'resolution':
      sortedImages.sort((a, b) => b.resolution - a.resolution);
      break;
  }
  
  // Extract just the URLs for rendering
  const urls = sortedImages.map(img => img.src);
  renderImageList(urls);
}

// Add this function right before initializePopup
function setupRescanButton() {
  const rescanBtn = document.getElementById('rescanBtn');
  if (!rescanBtn) return;
  
  rescanBtn.addEventListener('click', () => {
    // Add animation class
    rescanBtn.classList.add('scanning');
    
    // Inject the image grabber
    injectImageGrabber();
    
    // Remove animation class after animation completes
    setTimeout(() => {
      rescanBtn.classList.remove('scanning');
    }, 1000);
  });
}

async function initializePopup() {
  // Initialize settings first
  await initializeSettings();
  
  // Setup rescan button - ADD THIS LINE
  setupRescanButton();
  
  // Initialize sorting dropdown
  const sortDropdown = document.getElementById('sortDropdown');
  sortDropdown.value = currentSortMethod;
  sortDropdown.addEventListener('change', () => {
    currentSortMethod = sortDropdown.value;
    sortAndRenderImages();
  });
  
  // Initial grabber injection (always run once when popup opens)
  injectImageGrabber();

  // Get current settings
  const settings = getAllSettings();

  // Set up regular refresh based on settings mode
  if (settings.refreshMode === 'auto') {
    refreshInterval = setInterval(injectImageGrabber, settings.refreshInterval);
  } else {
    // Manual mode - ensure no interval is running
    if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
    }
  }

  // Listen for settings changes
  document.addEventListener('settingsChanged', (event) => {
    if (event.detail) {
      // Handle refresh mode change
      if (event.detail.refreshMode) {
        // Clear existing interval if any
        if (refreshInterval) {
          clearInterval(refreshInterval);
          refreshInterval = null;
        }
        
        // If auto mode is enabled, set up new interval
        if (event.detail.refreshMode === 'auto') {
          const interval = event.detail.refreshInterval || getRefreshInterval();
          refreshInterval = setInterval(injectImageGrabber, interval);
        }
        // For manual mode, the interval remains cleared
      }
    }
  });
  
  // Clean up when popup closes
  window.addEventListener('unload', () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
  });
}

document.addEventListener('DOMContentLoaded', initializePopup);

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'newImages') {
    handleNewImages(message.images);
  }
});
