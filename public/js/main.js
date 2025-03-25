// Add this to the top of main.js
console.log("Main.js loading...");

// Show payment instructions
function showPaymentInstructions() {
    if (!currentEditingPixel) {
        console.error("No pixel being edited");
        return;
    }
    
    // Hide pixel editor
    const pixelEditorEl = document.getElementById('pixelEditor');
    const paymentPopupEl = document.getElementById('paymentPopup');
    
    if (!pixelEditorEl || !paymentPopupEl) {
        console.error("Payment elements not found");
        return;
    }
    
    pixelEditorEl.classList.add('hidden');
    
    // Get pixel data from form
    const pixelColorEl = document.getElementById('pixelColor');
    const pixelHeightEl = document.getElementById('pixelHeight');
    const pixelMessageEl = document.getElementById('pixelMessage');
    const pixelOwnerNameEl = document.getElementById('pixelOwnerName');
    const pixelOwnerEmailEl = document.getElementById('pixelOwnerEmail');
    
    const { x, y } = currentEditingPixel;
    const color = currentImageDataUrl || (pixelColorEl ? pixelColorEl.value : '#4CAF50');
    const height = pixelHeightEl ? parseInt(pixelHeightEl.value) : 1;
    const message = pixelMessageEl ? pixelMessageEl.value.trim() : '';
    const ownerName = pixelOwnerNameEl ? pixelOwnerNameEl.value.trim() : 'Anonymous';
    const ownerEmail = pixelOwnerEmailEl ? pixelOwnerEmailEl.value.trim() : '';
    
    // Get price from config
    const config = window.uhuruConfig || { 
        payment: { 
            pricePerPixel: 10000, 
            additionalPricePerHeight: 10000,
            burnAddress: "1111111111111111111111111111111111111111111"
        } 
    };
    
    const price = config.payment.pricePerPixel + (height - 1) * config.payment.additionalPricePerHeight;
    
    // Generate a reference code
    const paymentReference = generatePaymentReference();
    
    // Update payment popup
    const burnAddressEl = document.getElementById('burnAddress');
    const paymentAmountEl = document.getElementById('paymentAmount');
    const paymentReferenceEl = document.getElementById('paymentReference');
    
    if (burnAddressEl) burnAddressEl.textContent = config.payment.burnAddress;
    if (paymentAmountEl) paymentAmountEl.textContent = `${price.toLocaleString()} POT`;
    if (paymentReferenceEl) paymentReferenceEl.textContent = paymentReference;
    
    // Set up copy buttons
    setupCopyButtons();
    
    // Set up payment buttons
    setupPaymentButtons(x, y, color, height, message, ownerName, ownerEmail, paymentReference, price);
    
    // Show payment popup
    paymentPopupEl.classList.remove('hidden');
}

// Generate a payment reference code
function generatePaymentReference() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `PIXEL-${timestamp}-${random}`.toUpperCase();
}

// Set up copy buttons in payment popup
function setupCopyButtons() {
    const copyAddressBtn = document.getElementById('copyAddressBtn');
    const copyReferenceBtn = document.getElementById('copyReferenceBtn');
    
    if (copyAddressBtn) {
        copyAddressBtn.onclick = function() {
            const address = document.getElementById('burnAddress').textContent;
            copyToClipboard(address, 'Burn address copied to clipboard!');
        };
    }
    
    if (copyReferenceBtn) {
        copyReferenceBtn.onclick = function() {
            const reference = document.getElementById('paymentReference').textContent;
            copyToClipboard(reference, 'Reference code copied to clipboard!');
        };
    }
}

// Copy text to clipboard and show toast
function copyToClipboard(text, toastMessage) {
    // Use the newer navigator.clipboard API if available
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text)
            .then(() => showToast(toastMessage))
            .catch(err => console.error('Could not copy text: ', err));
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showToast(toastMessage);
            } else {
                showToast('Failed to copy. Please select and copy manually.');
            }
        } catch (err) {
            console.error('Could not copy text: ', err);
            showToast('Failed to copy. Please select and copy manually.');
        }
        
        document.body.removeChild(textArea);
    }
}

// Show toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Trigger a reflow to enable the transition
    void toast.offsetWidth;
    
    // Show the toast
    toast.classList.add('show');
    
    // Hide and remove the toast after delay
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 2000);
}

// Set up payment buttons
function setupPaymentButtons(x, y, color, height, message, ownerName, ownerEmail, paymentReference, price) {
    const cancelPaymentBtn = document.getElementById('cancelPaymentBtn');
    const verifyPaymentBtn = document.getElementById('verifyPaymentBtn');
    
    if (cancelPaymentBtn) {
        cancelPaymentBtn.onclick = function() {
            document.getElementById('paymentPopup').classList.add('hidden');
        };
    }
    
    if (verifyPaymentBtn) {
        verifyPaymentBtn.onclick = function() {
            verifyPayment(x, y, color, height, message, ownerName, ownerEmail, paymentReference, price);
        };
    }
}

// Verify payment
function verifyPayment(x, y, color, height, message, ownerName, ownerEmail, paymentReference, price) {
    // Hide payment popup and show transaction popup
    const paymentPopupEl = document.getElementById('paymentPopup');
    const transactionPopupEl = document.getElementById('transactionPopup');
    
    if (!paymentPopupEl || !transactionPopupEl) {
        console.error("Transaction elements not found");
        return;
    }
    
    paymentPopupEl.classList.add('hidden');
    transactionPopupEl.classList.remove('hidden');
    
    // Get transaction ID
    const transactionIdEl = document.getElementById('transactionId');
    const transactionStatusEl = document.getElementById('transactionStatus');
    
    if (!transactionIdEl || !transactionStatusEl) {
        console.error("Transaction elements not found");
        return;
    }
    
    const txId = transactionIdEl.value.trim();
    
    if (!txId) {
        transactionStatusEl.textContent = "Please enter a valid transaction ID";
        
        // Return to payment popup after delay
        setTimeout(() => {
            transactionPopupEl.classList.add('hidden');
            paymentPopupEl.classList.remove('hidden');
        }, 2000);
        
        return;
    }
    
    transactionStatusEl.textContent = "Verifying payment...";
    
    // Simulate verification (for demo purposes)
    setTimeout(() => {
        // 90% chance of success for demo
        const success = Math.random() > 0.1;
        
        if (success) {
            transactionStatusEl.textContent = "Payment verified! Your pixel has been added.";
            
            // Add pixel to grid
            if (pixelGrid) {
                pixelGrid.setPixel(x, y, {
                    color,
                    height,
                    message,
                    owner: ownerName,
                    email: ownerEmail,
                    timestamp: Date.now(),
                    transactionId: txId,
                    paymentReference
                });
            }
            
            // Update project stats
            updateProjectStats();
            
            // Hide transaction popup after delay
            setTimeout(() => {
                transactionPopupEl.classList.add('hidden');
                currentEditingPixel = null;
            }, 3000);
        } else {
            transactionStatusEl.textContent = "Verification failed: Transaction not found or invalid";
            
            // Return to payment popup after delay
            setTimeout(() => {
                transactionPopupEl.classList.add('hidden');
                paymentPopupEl.classList.remove('hidden');
            }, 3000);
        }
    }, 2000);
}

// Load mock pixel data
function loadMockPixelData() {
    if (!pixelGrid) return;
    
    console.log("Loading mock pixel data");
    
    const mockPixels = [
        {
            x: 45,
            y: 45,
            color: '#FF9800',
            height: 3,
            message: 'Uhuru Cultural Arts Institute',
            owner: 'John Doe',
            timestamp: Date.now() - 86400000 * 5,
            email: 'john.doe@example.com',
            transactionId: '0x1234567890'
        },
        {
            x: 46,
            y: 45,
            color: '#4CAF50',
            height: 2,
            message: 'Supporting our community!',
            owner: 'Jane Doe',
            timestamp: Date.now() - 86400000 * 3,
            email: 'jane.doe@example.com',
            transactionId: '0x2345678901'
        },
        {
            x: 45,
            y: 46,
            color: '#2196F3',
            height: 4,
            message: 'Watoto Kwanza',
            owner: 'John Smith',
            timestamp: Date.now() - 86400000 * 2, // 2 days ago
            email: 'john.smith@example.com',
            transactionId: '0x3456789012'
        },
        {
            x: 46,
            y: 46,
            color: '#9C27B0',
            height: 2,
            message: 'Building the future together',
            owner: 'Jane Smith',
            timestamp: Date.now() - 86400000 * 1, // 1 day ago
            email: 'jane.smith@example.com',
            transactionId: '0x4567890123'
        }
    ];
    
    pixelGrid.loadPixelData(mockPixels);
}

// Update project stats
function updateProjectStats() {
    // For demo purposes, use mock data
    const stats = {
        totalPixels: 10000,
        pixelsSold: 464,
        fundsRaised: 5296
    };
    
    // Update stats in UI
    const totalPixelsEl = document.getElementById('totalPixels');
    const soldPixelsCountEl = document.getElementById('soldPixelsCount');
    const totalFundsRaisedEl = document.getElementById('totalFundsRaised');
    const pixelsSoldEl = document.getElementById('pixelsSold');
    const fundsRaisedEl = document.getElementById('fundsRaised');
    
    if (totalPixelsEl) totalPixelsEl.textContent = stats.totalPixels.toLocaleString();
    if (soldPixelsCountEl) soldPixelsCountEl.textContent = stats.pixelsSold.toLocaleString();
    if (totalFundsRaisedEl) totalFundsRaisedEl.textContent = `${stats.fundsRaised.toLocaleString()}`;
    if (pixelsSoldEl) pixelsSoldEl.textContent = stats.pixelsSold.toLocaleString();
    if (fundsRaisedEl) fundsRaisedEl.textContent = `${stats.fundsRaised.toLocaleString()}`;
}

// Create dancing pixels animation
function createDancingPixels() {
    const colors = ['#FF9800', '#4CAF50', '#2196F3', '#9C27B0', '#F44336'];
    const container = document.querySelector('main');
    
    if (!container) return;
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const pixel = document.createElement('div');
            pixel.classList.add('dancing-pixel');
            pixel.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            pixel.style.left = `${Math.random() * 90 + 5}%`;
            pixel.style.top = `${Math.random() * 50 + 25}%`;
            pixel.style.animationDelay = `${Math.random() * 2}s`;
            container.appendChild(pixel);
            
            // Remove after some time
            setTimeout(() => {
                pixel.remove();
            }, 10000);
        }, i * 2000);
    }
}

// Create confetti animation
function createConfetti() {
    const container = document.body;
    const colors = ['#FF9800', '#4CAF50', '#2196F3', '#9C27B0', '#F44336'];
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = `${Math.random() * 10 + 5}px`;
            confetti.style.height = `${Math.random() * 10 + 5}px`;
            confetti.style.opacity = Math.random() * 0.7 + 0.3;
            confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
            
            container.appendChild(confetti);
            
            // Remove after animation completes
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }, i * 300);
    }
}

// Create confetti at specific position
function createConfettiAt(x, y) {
    const container = document.body;
    const colors = ['#FF9800', '#4CAF50', '#2196F3', '#9C27B0', '#F44336'];
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = `${x}px`;
        confetti.style.top = `${y}px`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = `${Math.random() * 10 + 5}px`;
        confetti.style.opacity = Math.random() * 0.7 + 0.3;
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        
        container.appendChild(confetti);
        
        // Remove after animation completes
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Show random meme
function spawnRandomMeme() {
    const memes = [
        'When you buy your first pixel: "I\'m something of an artist myself"',
        'My wallet after buying pixels: "I\'ll never financially recover from this"',
        'Friend: What did you buy with crypto? Me: "It\'s a pixel. BUT IT\'S MINE!"',
        'Watching my pixel in 3D view: "Look what they need to mimic a fraction of our power!"'
    ];
    
    const memeText = memes[Math.floor(Math.random() * memes.length)];
    
    const memePopup = document.createElement('div');
    memePopup.style.position = 'fixed';
    memePopup.style.right = '20px';
    memePopup.style.top = '80px';
    memePopup.style.backgroundColor = 'var(--card-bg)';
    memePopup.style.color = 'var(--text-color)';
    memePopup.style.padding = '15px';
    memePopup.style.borderRadius = '10px';
    memePopup.style.maxWidth = '300px';
    memePopup.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
    memePopup.style.zIndex = '1000';
    memePopup.style.transition = 'all 0.3s ease';
    memePopup.style.animation = 'bounceTip 0.5s ease';
    memePopup.textContent = memeText;
    
    document.body.appendChild(memePopup);
    
    setTimeout(() => {
        memePopup.style.opacity = '0';
        setTimeout(() => {
            memePopup.remove();
        }, 500);
    }, 4000);
}

// State variables
let pixelGrid = null;
let currentEditingPixel = null;
let isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
let currentZoomScale = 1;
let currentImageDataUrl = null;

// Initialize application
function initApp() {
    console.log("Initializing Uhuru Pixel Garden application...");
    
    // Debug check for elements and dependencies
    const checks = {
        elements: checkElements(),
        three: !!window.THREE,
        config: !!window.uhuruConfig,
        pixelGrid: !!window.PixelGrid
    };
    
    console.log("Initialization checks:", checks);
    
    if (!checks.elements.canvasContainer) {
        console.error('Canvas container not found');
        return;
    }
    
    try {
        console.log("Creating pixel grid...");
        const container = checks.elements.canvasContainer;
        
        // Ensure container is properly sized
        container.style.width = '100%';
        container.style.height = '600px';
        container.style.position = 'relative';
        container.style.backgroundColor = '#f0f0f0';
        
        // Create new PixelGrid instance
        pixelGrid = new window.PixelGrid(container);
        console.log("PixelGrid instance created");
        
        // Initialize with 2D mode
        pixelGrid.setMode(false);
        
        // Set up click handler
        pixelGrid.onPixelClick((x, y, pixelData) => {
            console.log(`Pixel clicked: ${x}, ${y}`);
            if (pixelData) {
                showPixelInfo(pixelData);
            } else {
                showPixelEditor(x, y);
            }
        });
        
        // Load mock data
        loadMockPixelData();
        
        // Set up UI event handlers
        setupUIEventHandlers();
        
        // Update project stats
        updateProjectStats();
        
        // Set initial theme
        setTheme(isDarkMode);
        
        console.log("Application initialized successfully");
    } catch (error) {
        console.error('Error initializing pixel grid:', error);
        console.error(error.stack);
        createFallbackGrid();
    }
}

// Make initApp globally available
window.initApp = initApp;

// Add a backup initialization for the welcome overlay
(function() {
    try {
        const startExploringBtn = document.getElementById('startExploringBtn');
        if (startExploringBtn) {
            console.log("Setting up immediate welcome button handler");
            startExploringBtn.onclick = function() {
                const welcomeOverlay = document.getElementById('welcomeOverlay');
                if (welcomeOverlay) welcomeOverlay.classList.add('hidden');
            };
        }
    } catch (error) {
        console.error("Error in immediate welcome button setup:", error);
    }
})();

// Set up UI event handlers
function setupUIEventHandlers() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            isDarkMode = !isDarkMode;
            setTheme(isDarkMode);
        });
    }
    
    // View mode toggles
    setupViewToggles();
    
    // Close popup buttons
    document.querySelectorAll('.close-popup').forEach(el => {
        el.addEventListener('click', (e) => {
            const popup = e.target.closest('.popup');
            if (popup) popup.classList.add('hidden');
        });
    });
    
    // Meme button
    const memeButton = document.getElementById('memeButton');
    if (memeButton) {
        memeButton.addEventListener('click', spawnRandomMeme);
    }
    
    // Double-click confetti easter egg
    document.addEventListener('dblclick', (e) => {
        createConfettiAt(e.clientX, e.clientY);
    });
}

// Set up view toggles and controls
function setupViewToggles() {
    const toggle2DBtn = document.getElementById('toggle2D');
    const toggle3DBtn = document.getElementById('toggle3D');
    
    if (toggle2DBtn && toggle3DBtn && pixelGrid) {
        toggle2DBtn.addEventListener('click', () => {
            pixelGrid.setMode(false);
            toggle2DBtn.classList.add('active');
            toggle3DBtn.classList.remove('active');
        });
        
        toggle3DBtn.addEventListener('click', () => {
            pixelGrid.setMode(true);
            toggle3DBtn.classList.add('active');
            toggle2DBtn.classList.remove('active');
        });
    }

    // Set up zoom controls
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const resetViewBtn = document.getElementById('resetView');
    
    if (zoomInBtn && pixelGrid) {
        zoomInBtn.addEventListener('click', () => {
            currentZoomScale = Math.min(currentZoomScale + 0.1, 2.0);
            pixelGrid.setZoom(currentZoomScale);
        });
    }
    
    if (zoomOutBtn && pixelGrid) {
        zoomOutBtn.addEventListener('click', () => {
            currentZoomScale = Math.max(currentZoomScale - 0.1, 0.5);
            pixelGrid.setZoom(currentZoomScale);
        });
    }
    
    if (resetViewBtn && pixelGrid) {
        resetViewBtn.addEventListener('click', () => {
            currentZoomScale = 1;
            pixelGrid.setZoom(currentZoomScale);
            pixelGrid.resetView();
        });
    }
}

// Set theme (dark/light)
function setTheme(dark) {
    if (dark) {
        document.body.setAttribute('data-theme', 'dark');
        const moonIcon = document.getElementById('moonIcon');
        const sunIcon = document.getElementById('sunIcon');
        if (moonIcon) moonIcon.style.display = 'none';
        if (sunIcon) sunIcon.style.display = 'block';
    } else {
        document.body.removeAttribute('data-theme');
        const moonIcon = document.getElementById('moonIcon');
        const sunIcon = document.getElementById('sunIcon');
        if (moonIcon) moonIcon.style.display = 'block';
        if (sunIcon) sunIcon.style.display = 'none';
    }
}

// Show pixel info popup
function showPixelInfo(pixelData) {
    const pixelInfoPopupEl = document.getElementById('pixelInfoPopup');
    const content = document.getElementById('pixelInfoContent');
    if (!pixelInfoPopupEl || !content) {
        console.error("Pixel info popup elements not found");
        return;
    }
    
    // Build info content
    const ownerInfo = `<p><strong>Owner:</strong> ${pixelData.owner || 'Anonymous'}</p>`;
    const timestampInfo = `<p><strong>Purchased:</strong> ${new Date(pixelData.timestamp).toLocaleDateString()}</p>`;
    const messageInfo = pixelData.message ? `<p><strong>Message:</strong> ${pixelData.message}</p>` : '';
    
    content.innerHTML = `
        <div class="pixel-preview" style="background-color:${pixelData.color}"></div>
        ${ownerInfo}
        ${timestampInfo}
        ${messageInfo}
    `;
    
    // Add styling for the preview
    const style = document.createElement('style');
    style.textContent = `
        .pixel-preview {
            width: 60px;
            height: 60px;
            margin: 0 auto 1rem;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
    `;
    content.appendChild(style);
    
    // Show popup
    pixelInfoPopupEl.classList.remove('hidden');
}

// Show pixel editor
function showPixelEditor(x, y) {
    const pixelEditorEl = document.getElementById('pixelEditor');
    if (!pixelEditorEl) {
        console.error("Pixel editor element not found");
        return;
    }
    
    // Store current editing pixel
    currentEditingPixel = { x, y };
    
    // Reset form fields
    resetEditorForm();
    
    // Set up editor buttons
    setupEditorButtons(x, y);
    
    // Show editor
    pixelEditorEl.classList.remove('hidden');
    console.log(`Showing pixel editor for ${x}, ${y}`);
}

// Reset pixel editor form
function resetEditorForm() {
    // Get form elements
    const pixelColorEl = document.getElementById('pixelColor');
    const pixelHeightEl = document.getElementById('pixelHeight');
    const pixelMessageEl = document.getElementById('pixelMessage');
    const pixelOwnerNameEl = document.getElementById('pixelOwnerName');
    const pixelOwnerEmailEl = document.getElementById('pixelOwnerEmail');
    const imagePreviewEl = document.getElementById('imagePreview');
    const removeImageBtn = document.getElementById('removeImageBtn');
    
    // Reset values
    if (pixelColorEl) pixelColorEl.value = '#4CAF50';
    if (pixelHeightEl) pixelHeightEl.value = '1';
    if (pixelMessageEl) pixelMessageEl.value = '';
    if (pixelOwnerNameEl) pixelOwnerNameEl.value = '';
    if (pixelOwnerEmailEl) pixelOwnerEmailEl.value = '';
    
    // Reset image preview
    if (imagePreviewEl) {
        imagePreviewEl.style.backgroundImage = '';
        imagePreviewEl.classList.add('hidden');
    }
    
    if (removeImageBtn) {
        removeImageBtn.classList.add('hidden');
    }
    
    // Reset current image data URL
    currentImageDataUrl = null;
    
    // Set initial price based on height
    updatePriceDisplay();
}

// Set up pixel editor buttons
function setupEditorButtons(x, y) {
    // Cancel button
    const cancelEditBtn = document.getElementById('cancelEdit');
    if (cancelEditBtn) {
        cancelEditBtn.onclick = function() {
            document.getElementById('pixelEditor').classList.add('hidden');
            currentEditingPixel = null;
        };
    }
    
    // Proceed to payment button
    const proceedToPaymentBtn = document.getElementById('proceedToPayment');
    if (proceedToPaymentBtn) {
        proceedToPaymentBtn.onclick = function() {
            showPaymentInstructions();
        };
    }
    
    // Image upload button
    const uploadImageBtn = document.getElementById('uploadImageBtn');
    const pixelImageEl = document.getElementById('pixelImage');
    if (uploadImageBtn && pixelImageEl) {
        uploadImageBtn.onclick = function() {
            pixelImageEl.click();
        };
    }
    
    // Image remove button
    const removeImageBtn = document.getElementById('removeImageBtn');
    if (removeImageBtn) {
        removeImageBtn.onclick = function() {
            removeImage();
        };
    }
    
    // Height slider
    const pixelHeightEl = document.getElementById('pixelHeight');
    if (pixelHeightEl) {
        pixelHeightEl.oninput = updatePriceDisplay;
    }
    
    // Image file input
    if (pixelImageEl) {
        pixelImageEl.onchange = handleImageUpload;
    }
}

// Update price display based on height
function updatePriceDisplay() {
    const pixelHeightEl = document.getElementById('pixelHeight');
    const pixelPriceEl = document.getElementById('pixelPrice');
    
    if (!pixelHeightEl || !pixelPriceEl) return;
    
    const height = parseInt(pixelHeightEl.value) || 1;
    
    // Get price from config
    const config = window.uhuruConfig || { 
        payment: { 
            pricePerPixel: 10000, 
            additionalPricePerHeight: 10000
        } 
    };
    
    const price = config.payment.pricePerPixel + (height - 1) * config.payment.additionalPricePerHeight;
    pixelPriceEl.textContent = `${price.toLocaleString()} POT`;
}

// Handle image upload
function handleImageUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    
    const imagePreviewEl = document.getElementById('imagePreview');
    const removeImageBtn = document.getElementById('removeImageBtn');
    
    if (!imagePreviewEl || !removeImageBtn) return;
    
    // Simple image preview
    const reader = new FileReader();
    reader.onload = function(e) {
        currentImageDataUrl = e.target.result;
        imagePreviewEl.classList.remove('hidden');
        imagePreviewEl.style.backgroundImage = `url(${currentImageDataUrl})`;
        removeImageBtn.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

// Remove uploaded image
function removeImage() {
    const imagePreviewEl = document.getElementById('imagePreview');
    const removeImageBtn = document.getElementById('removeImageBtn');
    const pixelImageEl = document.getElementById('pixelImage');
    
    if (imagePreviewEl) {
        imagePreviewEl.style.backgroundImage = '';
        imagePreviewEl.classList.add('hidden');
    }
    
    if (removeImageBtn) {
        removeImageBtn.classList.add('hidden');
    }
    
    if (pixelImageEl) {
        pixelImageEl.value = '';
    }
    
    currentImageDataUrl = null;
}

// Add this to checkElements()
function checkElements() {
    console.log("Checking for required elements...");
    const elements = {
        canvasContainer: document.getElementById('canvasContainer'),
        startExploringBtn: document.getElementById('startExploringBtn'),
        welcomeOverlay: document.getElementById('welcomeOverlay'),
        pixelEditor: document.getElementById('pixelEditor'),
    };

    console.log("Found elements:", Object.entries(elements)
        .map(([name, el]) => `${name}: ${el ? 'YES' : 'NO'}`)
        .join(', '));
    
    // Check if config is loaded
    console.log("Config loaded:", window.config ? 'YES' : 'NO');
    // Check if PixelGrid is loaded
    console.log("PixelGrid loaded:", window.PixelGrid ? 'YES' : 'NO');
    
    return elements;
}

const elements = checkElements();
if (!elements.canvasContainer) {
    console.error('Critical elements missing');
    return;
}