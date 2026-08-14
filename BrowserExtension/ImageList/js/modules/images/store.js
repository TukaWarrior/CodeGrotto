// store.js - Data management for images
export class ImageStore {
  constructor() {
    this.imageData = []; 
    this.pendingImages = new Map();
    this.sortCriterion = 'timestamp';
    this.sortDirection = 'asc';
  }
  
  clear() {
    this.imageData = [];
    this.pendingImages.clear();
  }
  
  isImagePending(src) {
    return this.pendingImages.has(src);
  }
  
  isImageExists(src) {
    return this.imageData.findIndex(img => img.src === src) !== -1;
  }
  
  markImageAsPending(src, timestamp) {
    this.pendingImages.set(src, {
      timestamp,
      loading: true
    });
  }
  
  removeFromPending(src) {
    this.pendingImages.delete(src);
  }
  
  addImage(imageData) {
    console.log("Added image to store:", imageData.src);
    this.imageData.push(imageData);
  }
  
  getAllImages() {
    return [...this.imageData];
  }
  
  setSortCriterion(criterion) {
    this.sortCriterion = criterion;
  }
  
  setSortDirection(direction) {
    this.sortDirection = direction;
  }
  
  getSortedImages() {
    let sortedImages = [...this.imageData];
    const isAscending = this.sortDirection === 'asc';
    
    // Determine compare function based on criterion and direction
    let compareFunction;
    
    if (this.sortCriterion === 'timestamp') {
      if (isAscending) {
        // Oldest first
        compareFunction = (a, b) => a.timestamp - b.timestamp || a.order - b.order;
      } else {
        // Newest first
        compareFunction = (a, b) => b.timestamp - a.timestamp || b.order - a.order;
      }
    } else if (this.sortCriterion === 'resolution') {
      if (isAscending) {
        // Smallest first
        compareFunction = (a, b) => a.resolution - b.resolution;
      } else {
        // Largest first
        compareFunction = (a, b) => b.resolution - a.resolution;
      }
    }
    
    // Apply sorting
    if (compareFunction) {
      sortedImages.sort(compareFunction);
    }
    
    return sortedImages;
  }
}

// Export singleton instance
export const imageStore = new ImageStore();