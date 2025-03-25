// Image handler for Pixel Garden
// Handles image upload, validation, and processing

class ImageHandlerClass {
    constructor() {
        this.maxSize = 512; // Maximum image dimensions
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.maxSize;
        this.canvas.height = this.maxSize;
    }
    
    /**
     * Process an uploaded image file
     * @param {File} file - The image file to process
     * @returns {Promise} Promise that resolves with the image data URL
     */
    processImage(file) {
        return new Promise((resolve, reject) => {
            // Check if file is an image
            if (!file.type.match('image.*')) {
                reject(new Error('Please select an image file'));
                return;
            }
            
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                reject(new Error('Image too large (max 5MB)'));
                return;
            }
            
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    // Resize and center the image to 512x512
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    
                    // Determine dimensions to maintain aspect ratio
                    let width, height, offsetX = 0, offsetY = 0;
                    if (img.width > img.height) {
                        height = this.maxSize;
                        width = img.width * (height / img.height);
                        offsetX = (this.maxSize - width) / 2;
                    } else {
                        width = this.maxSize;
                        height = img.height * (width / img.width);
                        offsetY = (this.maxSize - height) / 2;
                    }
                    
                    // Draw image centered
                    this.ctx.drawImage(img, offsetX, offsetY, width, height);
                    
                    // Get data URL
                    const dataUrl = this.canvas.toDataURL('image/jpeg', 0.8);
                    resolve(dataUrl);
                };
                
                img.onerror = () => {
                    reject(new Error('Error loading image'));
                };
                
                img.src = e.target.result;
            };
            
            reader.onerror = () => {
                reject(new Error('Error reading file'));
            };
            
            reader.readAsDataURL(file);
        });
    }
    
    /**
     * Extract the dominant color from an image
     * @param {String} dataUrl - The image data URL
     * @returns {Promise} Promise that resolves with the dominant color hex
     */
    extractDominantColor(dataUrl) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                this.ctx.clearRect(0, 0, 1, 1);
                this.ctx.drawImage(img, 0, 0, 1, 1);
                const pixelData = this.ctx.getImageData(0, 0, 1, 1).data;
                const hex = this.rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
                resolve(hex);
            };
            img.src = dataUrl;
        });
    }
    
    /**
     * Convert RGB values to hex color code
     */
    rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }
}

// Create and export a singleton instance
export const ImageHandler = new ImageHandlerClass();