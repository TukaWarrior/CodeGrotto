// ==========================
// renderer.js
// ==========================

// Add this helper function to extract format
function getImageFormat(url) {
  const extensionMatch = url.match(/\.([a-z0-9]+)(\?|$)/i);
  if (extensionMatch && extensionMatch[1]) {
    return extensionMatch[1].toLowerCase();
  }
  return 'unknown';
}

// Add these helper functions
async function getFileSize(url) {
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

function calculateAspectRatio(width, height) {
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

// Track rendered images to avoid flickering
const renderedImages = new Map(); // src -> DOM element

export function renderImageList(images) {
  const list = document.getElementById("imageList");
  if (!list) return;

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
  renderedImages.forEach((element, src) => {
    if (!currentImageSet.has(src)) {
      element.remove();
      renderedImages.delete(src);
    }
  });

  // Set to track where in the DOM we've inserted each image
  const domPositions = new Map();
  let index = 0;
  
  // Add or reposition each image
  images.forEach(src => {
    domPositions.set(src, index++);
    
    // If we already rendered this image, just reposition it
    if (renderedImages.has(src)) {
      const card = renderedImages.get(src);
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
            
          if (beforeSrc && renderedImages.has(beforeSrc)) {
            const beforeEl = renderedImages.get(beforeSrc);
            beforeEl.after(card);
          } else {
            // Fallback - just append
            list.appendChild(card);
          }
        }
      }
      return;
    }
    
    // Otherwise create a new card
    const card = document.createElement("div");
    card.className = "image-card";

    // Save reference for future updates
    renderedImages.set(src, card);
    
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
      const format = getImageFormat(src);
      const aspectRatio = calculateAspectRatio(probeImg.naturalWidth, probeImg.naturalHeight);
      const fileSize = await getFileSize(src);
      
      // Create an info container with multiple lines
      resolution.innerHTML = `
        <div>${probeImg.naturalWidth}x${probeImg.naturalHeight}</div>
        <div>${format.toUpperCase()} · ${fileSize}</div>
        <div>${aspectRatio}</div>
      `;
    };
    probeImg.onerror = () => {
      const format = getImageFormat(src);
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
    
    // Extra button (updated with dropdown menu functionality)
    const extraBtn = document.createElement("button");
    extraBtn.className = "icon-button";
    extraBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>';
    extraBtn.title = "More Options";
    extraBtn.onclick = (event) => {
      // Same dropdown code as before...
      // [Code for dropdown omitted for brevity]
    };

    actions.appendChild(copyBtn);
    actions.appendChild(downloadBtn);
    actions.appendChild(extraBtn);

    mediaContainer.appendChild(imgContainer);
    mediaContainer.appendChild(actions);
    
    card.appendChild(mediaContainer);
    
    // Insert at the correct position
    const desiredPosition = domPositions.get(src);
    if (desiredPosition === 0) {
      list.prepend(card);
    } else if (desiredPosition >= list.children.length) {
      list.appendChild(card);
    } else {
      const beforeSrc = [...domPositions.entries()]
        .find(([_, pos]) => pos === desiredPosition - 1)?.[0];
        
      if (beforeSrc && renderedImages.has(beforeSrc)) {
        const beforeEl = renderedImages.get(beforeSrc);
        beforeEl.after(card);
      } else {
        // Fallback - just append
        list.appendChild(card);
      }
    }
  });
}