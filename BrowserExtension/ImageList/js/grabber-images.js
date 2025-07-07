// grabber-images.js
(function() {
  function collectImages() {
    let images = [];
    
    // 1. Get regular <img> tags
    const imgTags = Array.from(document.querySelectorAll('img'))
      .map(img => img.src)
      .filter(src => src && src.trim() !== '');
    images.push(...imgTags);
    
    // 2. Get background images from divs with class "image"
    const imageDivs = document.querySelectorAll('div.image');
    imageDivs.forEach(div => {
      const style = window.getComputedStyle(div);
      const bgImage = style.backgroundImage;
      
      if (bgImage && bgImage !== 'none') {
        const matches = bgImage.match(/url\(['"]?(.*?)['"]?\)/);
        if (matches && matches[1]) {
          images.push(matches[1]);
        }
      }
    });
    
    // 3. Get all elements with background images
    const elementsWithBg = document.querySelectorAll('[style*="background-image"]');
    elementsWithBg.forEach(el => {
      const style = window.getComputedStyle(el);
      const bgImage = style.backgroundImage;
      
      if (bgImage && bgImage !== 'none') {
        const matches = bgImage.match(/url\(['"]?(.*?)['"]?\)/);
        if (matches && matches[1]) {
          images.push(matches[1]);
        }
      }
    });
    
    // Remove duplicates
    images = [...new Set(images)];
    
    // Send the images back to the popup
    chrome.runtime.sendMessage({
      type: 'newImages',
      images: images
    });
  }
  
  // Collect images immediately
  collectImages();
})();