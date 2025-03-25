// Main.js for Uhuru Community Pixel Garden
// Handles UI interactions and initializes the pixel grid

// State variables
let pixelGrid;
let isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches; // Default based on system
let currentZoomScale = 1;

// Initialize when document is fully loaded
document.addEventListener('DOMContentLoaded', init);

// Initialize application
async function init() {
    console.log('Initializing application...');
    
    // Set up welcome overlay event listener
    const startExploringBtn = document.getElementById('startExploringBtn');
    if (startExploringBtn) {
        console.log('Found Start Exploring button');
        startExploringBtn.addEventListener('click', function() {
            console.log('Start button clicked');
            const welcomeOverlay = document.getElementById('welcomeOverlay');
            if (welcomeOverlay) welcomeOverlay.classList.add('hidden');
        });
    }
    
    // Initialize the pixel grid
    initializePixelGrid();
    
    // Set up theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            isDarkMode = !isDarkMode;
            setTheme(isDarkMode);
        });
    }
    
    // Set up Buy POT buttons
    document.querySelectorAll('.buy-pot-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            window.open('https://pump.fun', '_blank');
        });
    });
    
    // Toggle 2D/3D views
    const toggle2DBtn = document.getElementById('toggle2D');
    const toggle3DBtn = document.getElementById('toggle3D');
    
    if (toggle2DBtn) {
        toggle2DBtn.addEventListener('click', () => {
            if (pixelGrid) {
                pixelGrid.setMode(false);
                toggle2DBtn.classList.add('active');
                if (toggle3DBtn) toggle3DBtn.classList.remove('active');
            }
        });
    }
    
    if (toggle3DBtn) {
        toggle3DBtn.addEventListener('click', () => {
            if (pixelGrid) {
                pixelGrid.setMode(true);
                toggle3DBtn.classList.add('active');
                if (toggle2DBtn) toggle2DBtn.classList.remove('active');
            }
        });
    }
    
    // Set up zoom controls
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const resetViewBtn = document.getElementById('resetView');
    
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            if (pixelGrid) {
                currentZoomScale = Math.min(currentZoomScale + 0.1, 2.0);
                pixelGrid.setZoom(currentZoomScale);
            }
        });
    }
    
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            if (pixelGrid) {
                currentZoomScale = Math.max(currentZoomScale - 0.1, 0.5);
                pixelGrid.setZoom(currentZoomScale);
            }
        });
    }
    
    if (resetViewBtn) {
        resetViewBtn.addEventListener('click', () => {
            if (pixelGrid) pixelGrid.resetView();
        });
    }
    
    // Close popups
    document.querySelectorAll('.close-popup').forEach(el => {
        el.addEventListener('click', function(e) {
            const popup = e.target.closest('.popup');
            if (popup) popup.classList.add('hidden');
        });
    });
    
    // Set initial theme
    setTheme(isDarkMode);
    
    // Create fun elements
    createDancingPixels();
    createConfetti();
    
    // Redundantly handle the welcome overlay button
    handleWelcomeOverlay();
    
    console.log('Application initialized');
}

// Initialize the pixel grid
function initializePixelGrid() {
    try {
        const canvasContainer = document.getElementById('canvasContainer');
        if (!canvasContainer) {
            console.error('Canvas container not found');
            return;
        }
        
        // If using PixelGrid.js
        if (typeof PixelGrid === 'function') {
            console.log('Creating pixel grid...');
            pixelGrid = new PixelGrid(canvasContainer);
            
            // Set up click handler
            pixelGrid.onPixelClick((x, y, pixelData) => {
                if (pixelData) {
                    showPixelInfo(pixelData);
                } else {
                    // Start pixel edit
                    showPixelEditor(x, y);
                }
            });
            
            // Load mock data
            loadMockPixelData();
        } else {
            console.error('PixelGrid class not found, creating fallback');
            createFallbackGrid();
        }
    } catch (error) {
        console.error('Error initializing pixel grid:', error);
        createFallbackGrid();
    }
}

// Create a fallback grid if PixelGrid.js fails to load
function createFallbackGrid() {
    const canvasContainer = document.getElementById('canvasContainer');
    if (!canvasContainer) return;
    
    canvasContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem; background-color: #f5f5f5; border-radius: 8px;">
            <h2 style="color: #4CAF50; margin-bottom: 1rem;">Pixel Grid</h2>
            <p>The interactive grid could not be loaded. Please refresh the page or try a different browser.</p>
            <div style="display: grid; grid-template-columns: repeat(10, 1fr); gap: 2px; margin: 2rem auto; max-width: 300px;">
                ${Array(100).fill().map((_, i) => 
                    `<div style="aspect-ratio: 1; background-color: ${['#FF9800', '#4CAF50', '#2196F3', '#9C27B0', '#F44336'][Math.floor(Math.random() * 5)]}; opacity: ${Math.random() * 0.3 + 0.1}; border-radius: 2px;"></div>`
                ).join('')}
            </div>
        </div>
    `;
}

// Show pixel info popup
function showPixelInfo(pixelData) {
    const pixelInfoPopupEl = document.getElementById('pixelInfoPopup');
    const content = document.getElementById('pixelInfoContent');
    if (!pixelInfoPopupEl || !content) return;
    
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
    if (!pixelEditorEl) return;
    
    // Reset form
    const pixelColorEl = document.getElementById('pixelColor');
    const pixelHeightEl = document.getElementById('pixelHeight');
    const pixelMessageEl = document.getElementById('pixelMessage');
    const pixelOwnerNameEl = document.getElementById('pixelOwnerName');
    const pixelOwnerEmailEl = document.getElementById('pixelOwnerEmail');
    
    if (pixelColorEl) pixelColorEl.value = '#4CAF50';
    if (pixelHeightEl) pixelHeightEl.value = '1';
    if (pixelMessageEl) pixelMessageEl.value = '';
    if (pixelOwnerNameEl) pixelOwnerNameEl.value = '';
    if (pixelOwnerEmailEl) pixelOwnerEmailEl.value = '';
    
    // Reset image preview
    const imagePreviewEl = document.getElementById('imagePreview');
    const removeImageBtn = document.getElementById('removeImageBtn');
    
    if (imagePreviewEl) {
        imagePreviewEl.style.backgroundImage = '';
        imagePreviewEl.classList.add('hidden');
    }
    
    if (removeImageBtn) {
        removeImageBtn.classList.add('hidden');
    }
    
    // Show editor
    pixelEditorEl.classList.remove('hidden');
    
    // Set up event handlers
    const cancelEditBtn = document.getElementById('cancelEdit');
    if (cancelEditBtn) {
        cancelEditBtn.onclick = function() {
            pixelEditorEl.classList.add('hidden');
        };
    }
    
    const proceedToPaymentBtn = document.getElementById('proceedToPayment');
    if (proceedToPaymentBtn) {
        proceedToPaymentBtn.onclick = function() {
            showPaymentInstructions(x, y);
        };
    }
}

// Show payment instructions
function showPaymentInstructions(x, y) {
    const pixelEditorEl = document.getElementById('pixelEditor');
    const paymentPopupEl = document.getElementById('paymentPopup');
    
    if (!pixelEditorEl || !paymentPopupEl) return;
    
    // Hide pixel editor
    pixelEditorEl.classList.add('hidden');
    
    // Get values from form
    const pixelColorEl = document.getElementById('pixelColor');
    const pixelHeightEl = document.getElementById('pixelHeight');
    const pixelMessageEl = document.getElementById('pixelMessage');
    const pixelOwnerNameEl = document.getElementById('pixelOwnerName');
    const pixelOwnerEmailEl = document.getElementById('pixelOwnerEmail');
    
    const color = pixelColorEl ? pixelColorEl.value : '#4CAF50';
    const height = pixelHeightEl ? parseInt(pixelHeightEl.value) : 1;
    const message = pixelMessageEl ? pixelMessageEl.value.trim() : '';
    const ownerName = pixelOwnerNameEl ? pixelOwnerNameEl.value.trim() : 'Anonymous';
    const ownerEmail = pixelOwnerEmailEl ? pixelOwnerEmailEl.value.trim() : '';
    
    // Calculate price
    const config = window.uhuruConfig || { 
        payment: { 
            pricePerPixel: 10000, 
            additionalPricePerHeight: 10000,
            burnAddress: "1111111111111111111111111111111111111111111"
        } 
    };
    
    const price = config.payment.pricePerPixel + (height - 1) * config.payment.additionalPricePerHeight;
    
    // Generate payment reference
    const paymentReference = generatePaymentReference();
    
    // Update payment popup
    const burnAddressEl = document.getElementById('burnAddress');
    const paymentAmountEl = document.getElementById('paymentAmount');
    const paymentReferenceEl = document.getElementById('paymentReference');
    
    if (burnAddressEl) burnAddressEl.textContent = config.payment.burnAddress;
    if (paymentAmountEl) paymentAmountEl.textContent = `${price} POT`;
    if (paymentReferenceEl) paymentReferenceEl.textContent = paymentReference;
    
    // Show payment popup
    paymentPopupEl.classList.remove('hidden');
    
    // Set up payment popup buttons
    const cancelPaymentBtn = document.getElementById('cancelPaymentBtn');
    if (cancelPaymentBtn) {
        cancelPaymentBtn.onclick = function() {
            paymentPopupEl.classList.add('hidden');
        };
    }
    
    const verifyPaymentBtn = document.getElementById('verifyPaymentBtn');
    if (verifyPaymentBtn) {
        verifyPaymentBtn.onclick = function() {
            simulateVerifyPayment(x, y, {
                color,
                height,
                message,
                owner: ownerName,
                email: ownerEmail,
                paymentReference
            });
        };
    }
}

// Generate a unique payment reference
function generatePaymentReference() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `PIXEL-${timestamp}-${random}`.toUpperCase();
}

// Simulate payment verification (for demo)
function simulateVerifyPayment(x, y, pixelData) {
    const paymentPopupEl = document.getElementById('paymentPopup');
    const transactionPopupEl = document.getElementById('transactionPopup');
    
    if (!paymentPopupEl || !transactionPopupEl) return;
    
    // Hide payment popup
    paymentPopupEl.classList.add('hidden');
    
    // Show transaction popup
    transactionPopupEl.classList.remove('hidden');
    
    const transactionStatusEl = document.getElementById('transactionStatus');
    if (transactionStatusEl) {
        transactionStatusEl.textContent = "Verifying payment...";
    }
    
    // Get transaction ID
    const transactionIdEl = document.getElementById('transactionId');
    const txId = transactionIdEl ? transactionIdEl.value.trim() : '';
    
    if (!txId) {
        if (transactionStatusEl) {
            transactionStatusEl.textContent = "Please enter a valid transaction ID";
        }
        
        setTimeout(() => {
            transactionPopupEl.classList.add('hidden');
            paymentPopupEl.classList.remove('hidden');
        }, 2000);
        return;
    }
    
    // Simulate verification (success most of the time)
    setTimeout(() => {
        const success = Math.random() > 0.2; // 80% success rate
        
        if (success) {
            if (transactionStatusEl) {
                transactionStatusEl.textContent = "Payment verified! Your pixel has been added.";
            }
            
            // Add pixel to grid
            if (pixelGrid) {
                pixelGrid.setPixel(x, y, {
                    ...pixelData,
                    timestamp: Date.now(),
                    transactionId: txId
                });
            }
            
            // Hide transaction popup after delay
            setTimeout(() => {
                transactionPopupEl.classList.add('hidden');
            }, 3000);
        } else {
            if (transactionStatusEl) {
                transactionStatusEl.textContent = "Verification failed: Transaction not found";
            }
            
            // Return to payment popup after delay
            setTimeout(() => {
                transactionPopupEl.classList.add('hidden');
                paymentPopupEl.classList.remove('hidden');
            }, 3000);
        }
    }, 2000);
}

// Load some mock pixel data
function loadMockPixelData() {
    if (!pixelGrid) return;
    
    const mockPixels = [
        {
            x: 45,
            y: 45,
            color: '#FF9800',
            height: 3,
            message: 'Uhuru Cultural Arts Institute',
            owner: 'John Doe',
            timestamp: Date.now() - 86400000 * 5, // 5 days ago
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
            timestamp: Date.now() - 86400000 * 3, // 3 days ago
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

// Just to ensure the welcome overlay button works
function handleWelcomeOverlay() {
    const button = document.getElementById('startExploringBtn');
    const overlay = document.getElementById('welcomeOverlay');
    
    if (button && overlay) {
        // Set a direct onclick handler
        button.onclick = function() {
            overlay.classList.add('hidden');
        };
    }
}

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

function createDancingPixels() {
    // Create some dancing pixels for fun
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

// Add event listener for double-clicks
document.addEventListener('dblclick', function(e) {
    createConfettiAt(e.clientX, e.clientY);
});

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

// Set up at load time and when elements are ready
window.addEventListener('load', handleWelcomeOverlay);

// Extra backup for handling welcome overlay (runs immediately)
(function() {
    const startExploringBtn = document.getElementById('startExploringBtn');
    if (startExploringBtn) {
        startExploringBtn.onclick = function() {
            const welcomeOverlay = document.getElementById('welcomeOverlay');
            if (welcomeOverlay) welcomeOverlay.classList.add('hidden');
        }
    }
})();