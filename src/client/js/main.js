import { config } from './config';
import { PixelGrid } from './pixelGrid';
import { PaymentHandler } from './paymentHandler';
import { setupPixelEditor } from './pixel-utils';

// State variables
let pixelGrid;
let currentEditingPixel = null;
let isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches; // Default based on system

// DOM Elements
const pixelEditorEl = document.getElementById('pixelEditor');
const pixelInfoPopupEl = document.getElementById('pixelInfoPopup');
const transactionPopupEl = document.getElementById('transactionPopup');
const paymentPopupEl = document.getElementById('paymentPopup');
const pixelColorEl = document.getElementById('pixelColor');
const pixelHeightEl = document.getElementById('pixelHeight');
const pixelMessageEl = document.getElementById('pixelMessage');
const pixelOwnerNameEl = document.getElementById('pixelOwnerName');
const pixelOwnerEmailEl = document.getElementById('pixelOwnerEmail');
const proceedToPaymentBtn = document.getElementById('proceedToPayment');
const cancelEditBtn = document.getElementById('cancelEdit');
const toggle2DBtn = document.getElementById('toggle2D');
const toggle3DBtn = document.getElementById('toggle3D');
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const resetViewBtn = document.getElementById('resetView');
const canvasContainer = document.getElementById('canvasContainer');

// Add zoom scale variable
let currentZoomScale = 1;

// Initialize application
async function init() {
    try {
        // Initialize payment handler
        PaymentHandler.initialize();
        
        // Set up welcome overlay event listener
        document.getElementById('startExploringBtn').addEventListener('click', () => {
            document.getElementById('welcomeOverlay').classList.add('hidden');
        });
        
        // Set up Buy POT button in welcome overlay
        document.getElementById('mainBuyPotBtn').addEventListener('click', () => {
            window.open('https://pump.fun', '_blank');
        });
        
        // Initialize pixel grid
        pixelGrid = new PixelGrid(canvasContainer);
        
        // Set up pixel editor
        const pixelEditor = setupPixelEditor(pixelGrid);
        
        // Set up event handlers
        setupEventListeners(pixelEditor);
        
        // Load existing pixels from MongoDB
        await loadPixelData();
        
        // Update stats
        await updateProjectStats();
        
        // Set initial theme
        setTheme(isDarkMode);
        
        // Create fun elements
        createDancingPixels();
        createConfetti();
    } catch (error) {
        console.error("Error initializing application:", error);
        // Show fallback message if THREE.js fails to load
        if (error.message && error.message.includes('THREE')) {
            canvasContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <h2>3D Renderer Unavailable</h2>
                    <p>Your browser may not support 3D rendering or required libraries couldn't be loaded.</p>
                    <p>Please try a different browser like Chrome or Firefox.</p>
                </div>
            `;
        }
    }
}

function setupEventListeners(pixelEditor) {
    // Buy POT buttons
    document.querySelectorAll('.buy-pot-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            window.open('https://pump.fun', '_blank');
        });
    });
    
    // Pixel grid click handler
    pixelGrid.onPixelClick((x, y, pixelData) => {
        if (pixelData) {
            showPixelInfo(pixelData);
        } else {
            pixelEditor.startPixelEdit(x, y);
        }
    });
    
    // View toggles
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
    
    // View controls
    resetViewBtn.addEventListener('click', () => pixelGrid.resetView());
    
    // Add zoom controls event handlers
    zoomInBtn.addEventListener('click', () => {
        currentZoomScale = Math.min(currentZoomScale + 0.1, 2.0);
        pixelGrid.setZoom(currentZoomScale);
    });
    
    zoomOutBtn.addEventListener('click', () => {
        currentZoomScale = Math.max(currentZoomScale - 0.1, 0.5);
        pixelGrid.setZoom(currentZoomScale);
    });
    
    // Close popups
    document.querySelectorAll('.close-popup').forEach(el => {
        el.addEventListener('click', (e) => {
            e.target.closest('.popup').classList.add('hidden');
        });
    });
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        setTheme(isDarkMode);
    });
    
    // Payment popup buttons
    document.getElementById('cancelPaymentBtn').addEventListener('click', () => {
        paymentPopupEl.classList.add('hidden');
    });
    
    document.getElementById('verifyPaymentBtn').addEventListener('click', async () => {
        await verifyPayment();
    });
    
    // Copy buttons in payment popup
    document.getElementById('copyAddressBtn').addEventListener('click', () => {
        const address = document.getElementById('burnAddress').textContent;
        navigator.clipboard.writeText(address);
        showCopyToast('Burn address copied to clipboard!');
    });
    
    document.getElementById('copyReferenceBtn').addEventListener('click', () => {
        const ref = document.getElementById('paymentReference').textContent;
        navigator.clipboard.writeText(ref);
        showCopyToast('Reference code copied to clipboard!');
    });
    
    // Fun meme button
    const memeButton = document.getElementById('memeButton');
    if (memeButton) {
        memeButton.addEventListener('click', () => {
            spawnRandomMeme();
        });
    }
    
    // Easter egg: Double-click anywhere to spawn confetti
    document.addEventListener('dblclick', (e) => {
        createConfettiAt(e.clientX, e.clientY);
    });
}

function showCopyToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 2000);
    }, 10);
}

function showPixelInfo(pixelData) {
    const content = document.getElementById('pixelInfoContent');
    
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

async function loadPixelData() {
    try {
        // Fetch pixels from the database through our API
        const pixels = await PaymentHandler.getAllPixels();
        
        // Add pixels to the grid
        if (pixels && pixels.length > 0) {
            pixelGrid.loadPixelData(pixels);
        } else {
            console.log('No pixels found in the database');
        }
    } catch (error) {
        console.error('Error loading pixel data:', error);
    }
}

async function updateProjectStats() {
    try {
        // Fetch stats from the API
        const stats = await PaymentHandler.getProjectStats();
        
        // Update stats in UI
        document.getElementById('totalPixels').textContent = stats.totalPixels.toLocaleString();
        document.getElementById('soldPixelsCount').textContent = stats.pixelsSold.toLocaleString();
        document.getElementById('totalFundsRaised').textContent = `$${stats.fundsRaised.toLocaleString()}`;
        
        // Also update stats in the welcome overlay
        document.getElementById('pixelsSold').textContent = stats.pixelsSold.toLocaleString();
        document.getElementById('fundsRaised').textContent = `$${stats.fundsRaised.toLocaleString()}`;
    } catch (error) {
        console.error("Error updating project stats:", error);
    }
}

function setTheme(dark) {
    if (dark) {
        document.body.setAttribute('data-theme', 'dark');
        document.getElementById('moonIcon').style.display = 'none';
        document.getElementById('sunIcon').style.display = 'block';
    } else {
        document.body.removeAttribute('data-theme');
        document.getElementById('moonIcon').style.display = 'block';
        document.getElementById('sunIcon').style.display = 'none';
    }
}

function createDancingPixels() {
    // Create some dancing pixels for fun
    const colors = ['#FF9800', '#4CAF50', '#2196F3', '#9C27B0', '#F44336'];
    const container = document.querySelector('main');
    
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

async function verifyPayment() {
    // Show transaction processing
    paymentPopupEl.classList.add('hidden');
    transactionPopupEl.classList.remove('hidden');
    document.getElementById('transactionStatus').textContent = "Verifying payment...";
    
    // Get transaction ID from user input
    const txId = document.getElementById('transactionId').value.trim();
    
    if (!txId) {
        document.getElementById('transactionStatus').textContent = "Please enter a valid transaction ID";
        setTimeout(() => {
            transactionPopupEl.classList.add('hidden');
            paymentPopupEl.classList.remove('hidden');
        }, 2000);
        return;
    }
    
    try {
        // Call backend to verify the payment
        const result = await PaymentHandler.verifyPayment(txId);
        
        if (result.success) {
            // Update the pixel in the grid
            const payment = PaymentHandler.getCurrentPayment();
            pixelGrid.setPixel(payment.x, payment.y, {
                color: payment.color,
                height: payment.height,
                message: payment.message,
                owner: payment.ownerName,
                email: payment.ownerEmail,
                timestamp: Date.now(),
                transactionId: txId
            });
            
            // Update project stats
            updateProjectStats();
            
            // Show success message
            document.getElementById('transactionStatus').textContent = "Payment verified! Your pixel has been added.";
            
            // Clear current editing pixel
            currentEditingPixel = null;
            
            // Hide transaction popup after a delay
            setTimeout(() => {
                transactionPopupEl.classList.add('hidden');
            }, 3000);
        } else {
            document.getElementById('transactionStatus').textContent = `Verification failed: ${result.error}`;
            
            // Return to payment popup after a delay
            setTimeout(() => {
                transactionPopupEl.classList.add('hidden');
                paymentPopupEl.classList.remove('hidden');
            }, 3000);
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        document.getElementById('transactionStatus').textContent = "An error occurred during verification.";
        
        // Return to payment popup after a delay
        setTimeout(() => {
            transactionPopupEl.classList.add('hidden');
            paymentPopupEl.classList.remove('hidden');
        }, 3000);
    }
}

// Start the application
window.addEventListener('DOMContentLoaded', init);