// renderer.js - Image rendering functionality
import { imageStore } from './store.js';
import { eventBus, Events } from '../../core/events.js';
import { getAllSettings, saveSettings } from '../settings/settings-store.js';

export class ImageRenderer {
  constructor() {
    this.renderedImages = new Map(); // Track rendered DOM elements
    this.container = null;
  }
  
  initialize(container) {
    this.container = container;
    
    // Load sort settings
    const settings = getAllSettings();
    const sortCriterion = settings.sortCriterion || 'timestamp';
    const sortDirection = settings.sortDirection || 'asc';
    
    // Update the store
    imageStore.setSortCriterion(sortCriterion);
    imageStore.setSortDirection(sortDirection);
    
    // Set up sort controls
    this.setupSortControls(sortCriterion, sortDirection);
    
    // Create image list container
    const imageList = document.createElement('div');
    imageList.id = 'imageList';
    imageList.className = 'media-list';
    this.container.appendChild(imageList);
    
    // Subscribe to content updates
    eventBus.subscribe(Events.CONTENT_UPDATED, (data) => {
      if (data.type === 'image') {
        this.render();
      }
    });
  }
  
  setupSortControls(criterion, direction) {
    // Get references to the controls
    const sortCriterionDropdown = document.getElementById('sortCriterion');
    const sortDirectionButton = document.getElementById('sortDirection');
    
    if (!sortCriterionDropdown || !sortDirectionButton) return;
    
    // Set initial values
    sortCriterionDropdown.value = criterion;
    this.updateDirectionButtonState(sortDirectionButton, direction);
    
    // Add event listeners
    sortCriterionDropdown.addEventListener('change', () => {
      const newCriterion = sortCriterionDropdown.value;
      imageStore.setSortCriterion(newCriterion);
      saveSettings({ sortCriterion: newCriterion });
      this.render();
    });
    
    sortDirectionButton.addEventListener('click', () => {
      // Toggle direction
      const newDirection = imageStore.sortDirection === 'asc' ? 'desc' : 'asc';
      imageStore.setSortDirection(newDirection);
      this.updateDirectionButtonState(sortDirectionButton, newDirection);
      saveSettings({ sortDirection: newDirection });
      this.render();
    });
  }
  
  updateDirectionButtonState(button, direction) {
    // Update button appearance based on direction
    if (direction === 'asc') {
      button.classList.add('sort-ascending');
      button.classList.remove('sort-descending');
      button.title = 'Ascending (smallest/oldest first)';
    } else {
      button.classList.add('sort-descending');
      button.classList.remove('sort-ascending');
      button.title = 'Descending (largest/newest first)';
    }
  }
  
  render() {
    console.log("Rendering images:", imageStore.getAllImages().length);
    
    const list = document.getElementById('imageList');
    if (!list) return;
    
    const sortedImages = imageStore.getSortedImages();
    const images = sortedImages.map(img => img.src);
    
    // Handle empty state
    if (!images || images.length === 0) {
      list.innerHTML = '';
      const emptyState = document.createElement('div');
      emptyState.className = "empty-state";
      emptyState.innerHTML = `
        <span>📷</span>
        <p>No images found</p>
      `;
      list.appendChild(emptyState);
      return;
    }
    
    // If we previously had an empty state, clear it
    if (list.querySelector('.empty-state')) {
      list.innerHTML = '';
    }
    
    // Track which images we're going to keep
    const currentImageSet = new Set(images);
    
    // Remove any images that are no longer in the list
    this.renderedImages.forEach((element, src) => {
      if (!currentImageSet.has(src)) {
        element.remove();
        this.renderedImages.delete(src);
      }
    });
    
    // Set to track where in the DOM we've inserted each image
    const domPositions = new Map();
    let index = 0;
    
    // Add or reposition each image
    images.forEach(src => {
      domPositions.set(src, index++);
      
      // If we already rendered this image, just reposition it
      if (this.renderedImages.has(src)) {
        this.repositionElement(list, src, domPositions);
        return;
      }
      
      // Otherwise create a new card
      const card = this.createImageCard(src);
      
      // Insert at the correct position
      this.insertAtPosition(list, card, src, domPositions);
    });
  }
  
  repositionElement(list, src, domPositions) {
    const card = this.renderedImages.get(src);
    const currentPosition = Array.from(list.children).indexOf(card);
    const desiredPosition = domPositions.get(src);
    
    // Only move if necessary
    if (currentPosition !== desiredPosition) {
      if (desiredPosition === 0) {
        // Move to first position
        list.prepend(card);
      } else {
        // Find element that should be before this one
        const beforeSrc = [...domPositions.entries()]
          .find(([_, pos]) => pos === desiredPosition - 1)?.[0];
          
        if (beforeSrc && this.renderedImages.has(beforeSrc)) {
          const beforeEl = this.renderedImages.get(beforeSrc);
          beforeEl.after(card);
        } else {
          // Fallback - just append
          list.appendChild(card);
        }
      }
    }
  }
  
  insertAtPosition(list, card, src, domPositions) {
    const desiredPosition = domPositions.get(src);
    if (desiredPosition === 0) {
      list.prepend(card);
    } else if (desiredPosition >= list.children.length) {
      list.appendChild(card);
    } else {
      const beforeSrc = [...domPositions.entries()]
        .find(([_, pos]) => pos === desiredPosition - 1)?.[0];
        
      if (beforeSrc && this.renderedImages.has(beforeSrc)) {
        const beforeEl = this.renderedImages.get(beforeSrc);
        beforeEl.after(card);
      } else {
        // Fallback - just append
        list.appendChild(card);
      }
    }
  }
  
  createImageCard(src) {
    const card = document.createElement("div");
    card.className = "image-card";

    // Save reference for future updates
    this.renderedImages.set(src, card);
    
    // Image container
    const mediaContainer = document.createElement("div");
    mediaContainer.className = "media-container";
    
    // Left side - image
    const imgContainer = document.createElement("div");
    imgContainer.className = "image-container";
    
    const img = document.createElement("img");
    img.src = src;
    imgContainer.appendChild(img);
    
    // Resolution text
    const resolution = document.createElement("span");
    resolution.className = "image-resolution";
    resolution.textContent = 'Loading...';

    const probeImg = new Image();
    probeImg.onload = async () => {
      const format = this.getImageFormat(src);
      const aspectRatio = this.calculateAspectRatio(probeImg.naturalWidth, probeImg.naturalHeight);
      const fileSize = await this.getFileSize(src);
      
      // Create an info container with multiple lines
      resolution.innerHTML = `
        <div>${probeImg.naturalWidth}x${probeImg.naturalHeight}</div>
        <div>${format.toUpperCase()} · ${fileSize}</div>
        <div>${aspectRatio}</div>
      `;
    };
    probeImg.onerror = () => {
      const format = this.getImageFormat(src);
      resolution.textContent = `Unknown ${format}`;
    };
    probeImg.src = src;
    imgContainer.appendChild(resolution);
    
    // Right side - buttons
    const actions = document.createElement("div");
    actions.className = "actions";
    
    // Copy button
    const copyBtn = document.createElement("button");
    copyBtn.className = "icon-button";
    copyBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>';
    copyBtn.title = "Copy URL";
    copyBtn.onclick = () => navigator.clipboard.writeText(src);
    
    // Download button
    const downloadBtn = document.createElement("button");
    downloadBtn.className = "icon-button";
    downloadBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>';
    downloadBtn.title = "Download Image";
    downloadBtn.onclick = () => {
      const a = document.createElement("a");
      a.href = src;
      a.download = src.split('/').pop().split('?')[0];
      a.click();
    };
    
    // Extra button with dropdown menu
    const extraBtn = document.createElement("button");
    extraBtn.className = "icon-button";
    extraBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>';
    extraBtn.title = "More Options";
    extraBtn.onclick = (event) => this.showExtraMenu(event, src);

    actions.appendChild(copyBtn);
    actions.appendChild(downloadBtn);
    actions.appendChild(extraBtn);

    mediaContainer.appendChild(imgContainer);
    mediaContainer.appendChild(actions);
    
    card.appendChild(mediaContainer);
    
    return card;
  }
  
  showExtraMenu(event, src) {
    event.stopPropagation();
    
    // Create a simple dropdown menu
    const dropdown = document.createElement('div');
    dropdown.className = 'menu-dropdown';
    
    // Share option
    const shareBtn = document.createElement('button');
    shareBtn.textContent = 'Share';
    shareBtn.className = 'menu-item';
    shareBtn.onclick = (e) => {
      e.stopPropagation();
      
      if (navigator.share) {
        navigator.share({
          title: 'Shared Image',
          text: 'Check out this image',
          url: src
        }).catch(() => {
          navigator.clipboard.writeText(src);
          alert('Link copied to clipboard');
        });
      } else {
        navigator.clipboard.writeText(src);
        alert('Link copied to clipboard');
      }
      document.body.removeChild(dropdown);
    };
    
    // Open in new tab option
    const openBtn = document.createElement('button');
    openBtn.textContent = 'Open in new tab';
    openBtn.className = 'menu-item';
    openBtn.onclick = (e) => {
      e.stopPropagation();
      window.open(src, '_blank');
      document.body.removeChild(dropdown);
    };
    
    dropdown.appendChild(shareBtn);
    dropdown.appendChild(openBtn);
    document.body.appendChild(dropdown);
    
    // Close when clicking outside
    setTimeout(() => {
      const closeHandler = (e) => {
        if (!dropdown.contains(e.target) && e.target !== event.currentTarget) {
          document.body.removeChild(dropdown);
          document.removeEventListener('click', closeHandler);
        }
      };
      document.addEventListener('click', closeHandler);
    }, 0);
  }
  
  getImageFormat(url) {
    const extensionMatch = url.match(/\.([a-z0-9]+)(\?|$)/i);
    if (extensionMatch && extensionMatch[1]) {
      return extensionMatch[1].toLowerCase();
    }
    return 'unknown';
  }
  
  async getFileSize(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentLength = response.headers.get('content-length');
      if (contentLength) {
        const sizeInBytes = parseInt(contentLength, 10);
        if (sizeInBytes < 1024) {
          return `${sizeInBytes} B`;
        } else if (sizeInBytes < 1024 * 1024) {
          return `${(sizeInBytes / 1024).toFixed(1)} KiB`;
        } else {
          return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MiB`;
        }
      }
    } catch (e) {
      console.error("Error fetching file size:", e);
    }
    return 'Unknown size';
  }
  
  calculateAspectRatio(width, height) {
    if (!width || !height) return '';
    
    const gcd = (a, b) => {
      while (b) {
        let t = b;
        b = a % b;
        a = t;
      }
      return a;
    };
    
    const divisor = gcd(width, height);
    return `${width/divisor}:${height/divisor}`;
  }
}

// Export singleton instance
export const imageRenderer = new ImageRenderer();