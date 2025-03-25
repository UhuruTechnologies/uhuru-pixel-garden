// New file to handle pixel-related functionality moved from main.js
import { config } from './config.js';
import { PaymentHandler } from './paymentHandler.js';
import { ImageHandler } from './imageHandler.js';

// Handle pixel editor functionality
export function setupPixelEditor(pixelGrid) {
    // DOM Elements
    const pixelEditorEl = document.getElementById('pixelEditor');
    const pixelColorEl = document.getElementById('pixelColor');
    const pixelHeightEl = document.getElementById('pixelHeight');
    const pixelMessageEl = document.getElementById('pixelMessage');
    const pixelOwnerNameEl = document.getElementById('pixelOwnerName');
    const pixelOwnerEmailEl = document.getElementById('pixelOwnerEmail');
    const pixelImageEl = document.getElementById('pixelImage');
    const uploadImageBtn = document.getElementById('uploadImageBtn');
    const imagePreviewEl = document.getElementById('imagePreview');
    const removeImageBtn = document.getElementById('removeImageBtn');
    
    let currentEditingPixel = null;
    let currentImageDataUrl = null;
    
    function startPixelEdit(x, y) {
        currentEditingPixel = { x, y };
        
        // Reset form
        pixelColorEl.value = '#4CAF50';
        pixelHeightEl.value = '1';
        pixelMessageEl.value = '';
        pixelOwnerNameEl.value = '';
        pixelOwnerEmailEl.value = '';
        currentImageDataUrl = null;
        
        // Reset image preview
        imagePreviewEl.style.backgroundImage = '';
        imagePreviewEl.classList.add('hidden');
        removeImageBtn.classList.add('hidden');
        
        // Show editor
        pixelEditorEl.classList.remove('hidden');
        
        // Set initial price display based on default height
        updatePriceDisplay();
    }
    
    function updatePriceDisplay() {
        const height = parseInt(pixelHeightEl.value);
        const price = (config.payment.pricePerPixel + (height - 1) * config.payment.additionalPricePerHeight).toFixed(0);
        document.getElementById('pixelPrice').textContent = `${price} POT`;
    }
    
    function showPaymentInstructions() {
        if (!currentEditingPixel) return;
        
        // Hide pixel editor
        pixelEditorEl.classList.add('hidden');
        
        const { x, y } = currentEditingPixel;
        const color = currentImageDataUrl || pixelColorEl.value;
        const height = parseInt(pixelHeightEl.value);
        const message = pixelMessageEl.value.trim();
        const ownerName = pixelOwnerNameEl.value.trim();
        const ownerEmail = pixelOwnerEmailEl.value.trim();
        const price = config.payment.pricePerPixel + (height - 1) * config.payment.additionalPricePerHeight;
        
        // Store payment details in session
        PaymentHandler.setCurrentPayment({
            x, y, color, height, message, ownerName, ownerEmail, price,
            pixelId: `pixel_${x}_${y}`,
            paymentReference: generatePaymentReference()
        });
        
        // Show payment instructions
        document.getElementById('burnAddress').textContent = config.payment.burnAddress;
        document.getElementById('paymentAmount').textContent = `${price} POT`;
        document.getElementById('paymentReference').textContent = PaymentHandler.getCurrentPayment().paymentReference;
        document.getElementById('paymentPopup').classList.remove('hidden');
    }
    
    function generatePaymentReference() {
        // Generate a unique payment reference for verification
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `PIXEL-${timestamp}-${random}`.toUpperCase();
    }
    
    // Image upload handling
    uploadImageBtn.addEventListener('click', () => {
        pixelImageEl.click();
    });
    
    pixelImageEl.addEventListener('change', async (event) => {
        if (event.target.files && event.target.files[0]) {
            try {
                const file = event.target.files[0];
                // Show loading indicator
                imagePreviewEl.classList.remove('hidden');
                imagePreviewEl.style.backgroundImage = '';
                imagePreviewEl.textContent = 'Processing image...';
                
                // Process the image
                currentImageDataUrl = await ImageHandler.processImage(file);
                
                // Update preview
                imagePreviewEl.textContent = '';
                imagePreviewEl.style.backgroundImage = `url(${currentImageDataUrl})`;
                removeImageBtn.classList.remove('hidden');
                
                // Set color input to dominant color for 3D mode
                const dominantColor = await ImageHandler.extractDominantColor(currentImageDataUrl);
                pixelColorEl.value = dominantColor;
            } catch (error) {
                alert(error.message);
                imagePreviewEl.classList.add('hidden');
            }
        }
    });
    
    removeImageBtn.addEventListener('click', () => {
        currentImageDataUrl = null;
        imagePreviewEl.style.backgroundImage = '';
        imagePreviewEl.classList.add('hidden');
        removeImageBtn.classList.add('hidden');
        pixelImageEl.value = '';
    });
    
    // Pixel height slider
    pixelHeightEl.addEventListener('input', updatePriceDisplay);
    
    // Payment buttons
    document.getElementById('cancelEdit').addEventListener('click', () => {
        pixelEditorEl.classList.add('hidden');
        currentEditingPixel = null;
    });
    
    document.getElementById('proceedToPayment').addEventListener('click', showPaymentInstructions);
    
    return {
        startPixelEdit,
        updatePriceDisplay,
        getCurrentEditingPixel: () => currentEditingPixel,
        setCurrentEditingPixel: (pixel) => { currentEditingPixel = pixel; }
    };
}