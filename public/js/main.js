// Simple main.js without module imports for core functionality
// We'll handle basic UI interactions here

// State variables
let isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches; // Default based on system
let currentZoomScale = 1;

// Initialize when document is fully loaded
document.addEventListener('DOMContentLoaded', init);

// Initialize application
function init() {
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