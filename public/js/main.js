// Consolidated main.js - Fix for Uhuru Community Pixel Garden
import { config } from './config.js';
import { PixelGrid } from './pixelGrid.js';
import { PaymentHandler } from './paymentHandler.js';
import { setupPixelEditor } from './pixel-utils.js';

// State variables
let pixelGrid;
let currentEditingPixel = null;
let isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches; // Default based on system
let currentZoomScale = 1;
let currentImageDataUrl = null;

// Initialize application
function init() {
    console.log("Initializing Uhuru Community Pixel Garden...");
    
    try {
        // Initialize payment handler
        PaymentHandler.initialize();
        
        // Set up welcome overlay event listener
        const startExploringBtn = document.getElementById('startExploringBtn');
        if (startExploringBtn) {
            startExploringBtn.addEventListener('click', () => {
                const welcomeOverlay = document.getElementById('welcomeOverlay');
                if (welcomeOverlay) welcomeOverlay.classList.add('hidden');
            });
        }
        
        // Set up Buy POT button in welcome overlay
        const mainBuyPotBtn = document.getElementById('mainBuyPotBtn');
        if (mainBuyPotBtn) {
            mainBuyPotBtn.addEventListener('click', () => {
                window.open('https://pump.fun', '_blank');
            });
        }
        
        // Initialize canvas container sizing
        const canvasContainer = document.getElementById('canvasContainer');
        if (canvasContainer) {
            canvasContainer.style.width = '100%';
            canvasContainer.style.minHeight = '500px';
            canvasContainer.style.position = 'relative';
        }
        
        // Initialize pixel grid
        pixelGrid = new PixelGrid(canvasContainer);
        
        // Set up pixel editor
        const pixelEditor = setupPixelEditor(pixelGrid);
        
        // Set up event handlers
        setupEventListeners(pixelEditor);
        
        // Load any existing pixels
        loadPixelData();
        
        // Update stats
        updateProjectStats();
        
        // Set initial theme
        setTheme(isDarkMode);
        
        // Create fun elements
        createDancingPixels();
        createConfetti();
        
        console.log("Initialization complete!");
    } catch (error) {
        console.error("Error initializing application:", error);
        // Show fallback message if initialization fails
        const canvasContainer = document.getElementById('canvasContainer');
        if (canvasContainer) {
            canvasContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; background-color: #f8f9fa; border-radius: 8px;">
                    <h2 style="color: #4CAF50;">Pixel Garden Unavailable</h2>
                    <p>We encountered an error loading the pixel garden. Please try refreshing the page.</p>
                    <p>Error details: ${error.message}</p>
                </div>
            `;
        }
    }
}

function setupEventListeners(pixelEditor) {
    console.log("Setting up event listeners...");
    
    // Buy POT buttons
    document.querySelectorAll('.buy-pot-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            window.open('https://pump.fun', '_blank');
        });
    });
    
    // Pixel grid click handler
    if (pixelGrid) {
        pixelGrid.onPixelClick((x, y, pixelData) => {
            if (pixelData) {
                showPixelInfo(pixelData);
            } else {
                pixelEditor.startPixelEdit(x, y);
            }
        });
    }
    
    // View toggles
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
    
    // View controls
    const resetViewBtn = document.getElementById('resetView');
    if (resetViewBtn && pixelGrid) {
        resetViewBtn.addEventListener('click', () => pixelGrid.resetView());
    }
    
    // Add zoom controls event handlers
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    
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
    
    // Close popups
    document.querySelectorAll('.close-popup').forEach(el => {
        el.addEventListener('click', (e) => {
            const popup = e.target.closest('.popup');
            if (popup) popup.classList.add('hidden');
        });
    });
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            isDarkMode = !isDarkMode;
            setTheme(isDarkMode);
        });
    }
    
    // Fun meme button
    const memeButton = document.getElementById('memeButton');
    if (memeButton) {
        memeButton.addEventListener('click', () => {
            spawnRandomMeme();
        });
    }
    
    // Set up payment popup copy buttons
    setupCopyButtons();
    
    // Set up payment verification
    const verifyPaymentBtn = document.getElementById('verifyPaymentBtn');
    if (verifyPaymentBtn) {
        verifyPaymentBtn.addEventListener('click', () => {
            verifyPayment();
        });
    }
    
    // Cancel payment
    const cancelPaymentBtn = document.getElementById('cancelPaymentBtn');
    if (cancelPaymentBtn) {
        cancelPaymentBtn.addEventListener('click', () => {
            document.getElementById('paymentPopup').classList.add('hidden');
        });
    }
    
    // Easter egg: Double-click anywhere to spawn confetti
    document.addEventListener('dblclick', (e) => {
        createConfettiAt(e.clientX, e.clientY);
    });
    
    console.log("Event listeners set up");
}

function showPixelInfo(pixelData) {
    const pixelInfoPopupEl = document.getElementById('pixelInfoPopup');
    const content = document.getElementById('pixelInfoContent');
    
    if (!pixelInfoPopupEl || !content) {
        console.error("Could not find pixel info elements");
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

function loadPixelData() {
    if (!pixelGrid) {
        console.error("Cannot load pixel data: pixelGrid not initialized");
        return;
    }
    
    console.log("Loading mock pixel data...");
    
    // In a real app, this would load data from the blockchain
    // For the demo, we'll load some mock data
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
    
    // Add pixels to the grid
    pixelGrid.loadPixelData(mockPixels);
    console.log("Mock pixel data loaded");
}

function updateProjectStats() {
    try {
        // For demo purposes, use mock data
        const stats = {
            totalPixels: 10000,
            pixelsSold: 464,
            fundsRaised: 5286
        };
        
        // Update stats in UI
        const totalPixelsEl = document.getElementById('totalPixels');
        const soldPixelsCountEl = document.getElementById('soldPixelsCount');
        const totalFundsRaisedEl = document.getElementById('totalFundsRaised');
        const pixelsSoldEl = document.getElementById('pixelsSold');
        const fundsRaisedEl = document.getElementById('fundsRaised');
        
        if (totalPixelsEl) totalPixelsEl.textContent = stats.totalPixels.toLocaleString();
        if (soldPixelsCountEl) soldPixelsCountEl.textContent = stats.pixelsSold.toLocaleString();
        if (totalFundsRaisedEl) totalFundsRaisedEl.textContent = `$${stats.fundsRaised.toLocaleString()}`;
        if (pixelsSoldEl) pixelsSoldEl.textContent = stats.pixelsSold.toLocaleString();
        if (fundsRaisedEl) fundsRaisedEl.textContent = `$${stats.fundsRaised.toLocaleString()}`;
    } catch (error) {
        console.error("Error updating project stats:", error);
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

// Set up copy buttons in payment popup
function setupCopyButtons() {
    const copyAddressBtn = document.getElementById('copyAddressBtn');
    const copyReferenceBtn = document.getElementById('copyReferenceBtn');
    
    if (copyAddressBtn) {
        copyAddressBtn.addEventListener('click', function() {
            const address = document.getElementById('burnAddress').textContent;
            copyToClipboard(address, 'Burn address copied to clipboard!');
        });
    }
    
    if (copyReferenceBtn) {
        copyReferenceBtn.addEventListener('click', function() {
            const reference = document.getElementById('paymentReference').textContent;
            copyToClipboard(reference, 'Reference code copied to clipboard!');
        });
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
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    toast.style.color = 'white';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '4px';
    toast.style.zIndex = '10000';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    
    document.body.appendChild(toast);
    
    // Trigger a reflow to enable the transition
    void toast.offsetWidth;
    
    // Show the toast
    toast.style.opacity = '1';
    
    // Hide and remove the toast after delay
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 2000);
}

function verifyPayment() {
    // Get current payment
    const payment = PaymentHandler.getCurrentPayment();
    if (!payment) {
        showToast('No active payment to verify');
        return;
    }
    
    // Show transaction processing
    const paymentPopupEl = document.getElementById('paymentPopup');
    const transactionPopupEl = document.getElementById('transactionPopup');
    
    if (paymentPopupEl) paymentPopupEl.classList.add('hidden');
    if (transactionPopupEl) {
        transactionPopupEl.classList.remove('hidden');
        const statusEl = document.getElementById('transactionStatus');
        if (statusEl) statusEl.textContent = "Verifying payment...";
    }
    
    // Get transaction ID from user input
    const txIdEl = document.getElementById('transactionId');
    const txId = txIdEl ? txIdEl.value.trim() : '';
    
    if (!txId) {
        if (transactionPopupEl) {
            const statusEl = document.getElementById('transactionStatus');
            if (statusEl) statusEl.textContent = "Please enter a valid transaction ID";
            
            // Return to payment popup after delay
            setTimeout(() => {
                transactionPopupEl.classList.add('hidden');
                if (paymentPopupEl) paymentPopupEl.classList.remove('hidden');
            }, 2000);
        }
        return;
    }
    
    // Simulate verification (for demo purposes)
    setTimeout(() => {
        // 90% chance of success
        const success = Math.random() > 0.1;
        
        if (success) {
            // Update status
            const statusEl = document.getElementById('transactionStatus');
            if (statusEl) statusEl.textContent = "Payment verified! Your pixel has been added.";
            
            // Add pixel to grid
            if (pixelGrid && payment) {
                pixelGrid.setPixel(payment.x, payment.y, {
                    color: payment.color,
                    height: payment.height,
                    message: payment.message,
                    owner: payment.ownerName,
                    email: payment.ownerEmail,
                    timestamp: Date.now(),
                    transactionId: txId
                });
            }
            
            // Update project stats
            updateProjectStats();
            
            // Clear current editing pixel
            currentEditingPixel = null;
            
            // Hide transaction popup after a delay
            setTimeout(() => {
                if (transactionPopupEl) transactionPopupEl.classList.add('hidden');
            }, 3000);
        } else {
            // Update status for failure
            const statusEl = document.getElementById('transactionStatus');
            if (statusEl) statusEl.textContent = "Verification failed: Transaction not found or invalid";
            
            // Return to payment popup after delay
            setTimeout(() => {
                if (transactionPopupEl) transactionPopupEl.classList.add('hidden');
                if (paymentPopupEl) paymentPopupEl.classList.remove('hidden');
            }, 3000);
        }
    }, 2000);
}

// Start the application when page is loaded
window.addEventListener('DOMContentLoaded', init);