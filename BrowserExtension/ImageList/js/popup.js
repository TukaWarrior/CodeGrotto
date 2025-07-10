// ==========================
// popup.js
// ==========================
import { renderImageList } from './renderer.js';
import { initializeSettings, getRefreshInterval, updateRefreshInterval } from './settings.js';

// Track images with metadata
let imageData = [];
let currentSortMethod = 'oldest';
let refreshInterval = null;

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
  
  imageData.push({
    src,
    timestamp,
    order: imageData.length,
    width: 0,
    height: 0,
    resolution: 0,
    loaded: false
  });

  // Get resolution data
  const img = new Image();
  
  // Set a timeout to remove images that fail to load
  const loadTimeout = setTimeout(() => {
    const index = imageData.findIndex(i => i.src === src && !i.loaded);
    if (index !== -1) {
      imageData.splice(index, 1);
      sortAndRenderImages();
    }
  }, 5000);
  
  img.onload = () => {
    clearTimeout(loadTimeout);
    
    const item = imageData.find(i => i.src === src);
    if (item) {
      // Enhanced filtering - filter out small images that are likely tracking pixels
      // Increased minimum size from 1x1 to more aggressively filter
      if (img.naturalWidth <= 5 || img.naturalHeight <= 5) {
        imageData = imageData.filter(i => i.src !== src);
        sortAndRenderImages();
        return;
      }
      
      // Add a delay before showing new images to ensure they're stable
      setTimeout(() => {
        item.width = img.naturalWidth;
        item.height = img.naturalHeight;
        item.resolution = img.naturalWidth * img.naturalHeight;
        item.loaded = true;
        sortAndRenderImages();
      }, 200);
    }
  };
  
  img.onerror = () => {
    clearTimeout(loadTimeout);
    imageData = imageData.filter(i => i.src !== src);
    sortAndRenderImages();
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
    // This will give us the original, uncropped version
    if (!imageGroups[baseUrl]) {
      imageGroups[baseUrl] = baseUrl; // Store only the base URL without parameters
    }
  });
  
  // Process each base URL - they're already stripped of parameters
  Object.keys(imageGroups).forEach(baseUrl => {
    // Check if we already have this base URL
    const existingIndex = imageData.findIndex(img => 
      img.src === baseUrl || (img.src.startsWith(baseUrl) && 
        (img.src.length === baseUrl.length || img.src.charAt(baseUrl.length) === '?' || 
         img.src.charAt(baseUrl.length) === '#'))
    );
    
    if (existingIndex === -1) {
      // New image, add the clean base URL
      addNewImage(baseUrl, timestamp);
    }
  });
  
  sortAndRenderImages();
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

async function initializePopup() {
  // Initialize settings first
  await initializeSettings();
  
  // Initialize sorting dropdown
  const sortDropdown = document.getElementById('sortDropdown');
  sortDropdown.value = currentSortMethod;
  sortDropdown.addEventListener('change', () => {
    currentSortMethod = sortDropdown.value;
    sortAndRenderImages();
  });
  
  // Initial grabber injection
  injectImageGrabber();
  
  // Set up regular refresh based on settings
  const interval = getRefreshInterval();
  refreshInterval = updateRefreshInterval(interval, injectImageGrabber);
  
  // Listen for settings changes
  document.addEventListener('settingsChanged', (event) => {
    if (event.detail && event.detail.refreshInterval) {
      refreshInterval = updateRefreshInterval(
        event.detail.refreshInterval, 
        injectImageGrabber
      );
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
