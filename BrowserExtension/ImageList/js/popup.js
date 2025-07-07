// ==========================
// popup.js
// ==========================
import { renderImageList } from './renderer.js';

// Track images with metadata
let imageData = [];
let currentSortMethod = 'oldest';

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
  img.onload = () => {
    const item = imageData.find(i => i.src === src);
    if (item) {
      item.width = img.naturalWidth;
      item.height = img.naturalHeight;
      item.resolution = img.naturalWidth * img.naturalHeight;
      item.loaded = true;
      sortAndRenderImages();
    }
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

function initializePopup() {
  // Initialize sorting dropdown
  const sortDropdown = document.getElementById('sortDropdown');
  
  // Set dropdown to match the current sort method
  sortDropdown.value = currentSortMethod;
  
  sortDropdown.addEventListener('change', () => {
    currentSortMethod = sortDropdown.value;
    sortAndRenderImages();
  });
  
  // Initial grabber injection
  injectImageGrabber();
  
  // Set up regular refresh (every second)
  const refreshInterval = setInterval(injectImageGrabber, 1000);
  
  // Clean up when popup closes
  window.addEventListener('unload', () => {
    clearInterval(refreshInterval);
  });
}

document.addEventListener('DOMContentLoaded', initializePopup);

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'newImages') {
    handleNewImages(message.images);
  }
});
