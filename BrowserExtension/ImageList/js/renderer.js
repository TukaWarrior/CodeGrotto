// ==========================
// renderer.js
// ==========================
export function renderImageList(images) {
  const list = document.getElementById("imageList");
  if (!list) return;

  list.innerHTML = '';

  const unique = [...new Set(images || [])];
  if (unique.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = "empty-state";
    emptyState.innerHTML = `
      <span>📷</span>
      <p>No images found</p>
    `;
    list.appendChild(emptyState);
    return;
  }

  unique.forEach(src => {
    const card = document.createElement("div");
    card.className = "image-card";

    // Image container (now with flex layout)
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
    probeImg.onload = () => {
      resolution.textContent = `${probeImg.naturalWidth}x${probeImg.naturalHeight}`;
    };
    probeImg.onerror = () => {
      resolution.textContent = 'Unknown';
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
    
    // Extra button (no function yet)
    const extraBtn = document.createElement("button");
    extraBtn.className = "icon-button";
    extraBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>';
    extraBtn.title = "More Options";

    actions.appendChild(copyBtn);
    actions.appendChild(downloadBtn);
    actions.appendChild(extraBtn);

    mediaContainer.appendChild(imgContainer);
    mediaContainer.appendChild(actions);
    
    card.appendChild(mediaContainer);
    list.appendChild(card);
  });
}