import React, { useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';

export default function HomePage() {
  // Handle the welcome overlay button click
  useEffect(() => {
    const handleStartExploring = () => {
      const welcomeOverlay = document.getElementById('welcomeOverlay');
      if (welcomeOverlay) {
        welcomeOverlay.classList.add('hidden');
      }
    };

    const startExploringBtn = document.getElementById('startExploringBtn');
    if (startExploringBtn) {
      startExploringBtn.addEventListener('click', handleStartExploring);
    }

    return () => {
      if (startExploringBtn) {
        startExploringBtn.removeEventListener('click', handleStartExploring);
      }
    };
  }, []);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Uhuru Community Pixel Garden</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;700&family=Outfit:wght@400;600;800&display=swap"
          rel="stylesheet"
        />
        <script type="importmap" dangerouslySetInnerHTML={{
          __html: `
            {
              "imports": {
                "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
                "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
              }
            }
          `
        }} />
      </Head>

      {/* Theme Toggle Button */}
      <button id="themeToggle" className="theme-toggle" aria-label="Toggle dark/light mode">
        <svg id="moonIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 11.807A9.002 9.002 0 0 1 10.049 2a9.942 9.942 0 0 0-5.12 2.735c-3.905 3.905-3.905 10.237 0 14.142 3.906 3.906 10.237 3.905 14.143 0a9.946 9.946 0 0 0 2.735-5.119A9.003 9.003 0 0 1 12 11.807z"></path>
        </svg>
        <svg id="sunIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'none' }}>
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"></path>
        </svg>
      </button>

      {/* Meme Corner */}
      <div className="meme-corner" id="memeButton">
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 36C27.9411 36 36 27.9411 36 18C36 8.05887 27.9411 0 18 0C8.05887 0 0 8.05887 0 18C0 27.9411 8.05887 36 18 36Z" fill="#FFCC4D"/>
          <path d="M18 21C15.2386 21 13 18.7614 13 16H15C15 17.6569 16.3431 19 18 19C19.6569 19 21 17.6569 21 16H23C23 18.7614 20.7614 21 18 21Z" fill="#664500"/>
          <path d="M25.485 11.515C24.7044 10.7345 23.4645 10.7345 22.6839 11.515L21.5 12.6989L20.316 11.515C19.5354 10.7345 18.2956 10.7345 17.515 11.515C16.7345 12.2956 16.7345 13.5354 17.515 14.316L21.5 18.301L25.485 14.316C26.2655 13.5354 26.2655 12.2956 25.485 11.515Z" fill="#DD2E44"/>
          <path d="M7.5 16C9.5 16 9.5 13 7.5 13C5.5 13 5.5 16 7.5 16Z" fill="#664500"/>
          <path d="M28.5 16C30.5 16 30.5 13 28.5 13C26.5 13 26.5 16 28.5 16Z" fill="#664500"/>
        </svg>
      </div>
      <div className="meme-content">
        <p>Click for random pixel memes!</p>
      </div>

      <div className="overlay" id="welcomeOverlay">
        <div className="connect-container">
          <div className="logo-container">
            <svg id="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" fill="#4CAF50" />
              <path d="M30,50 Q50,20 70,50 T30,50" fill="#2E7D32" stroke="#FFF" strokeWidth="2" />
              <circle cx="50" cy="40" r="8" fill="#FF9800" />
              {/* Add extra fun elements to the logo */}
              <circle cx="40" cy="35" r="3" fill="#FFF" opacity="0.8">
                <animate attributeName="opacity" values="0.8;0.2;0.8" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="60" cy="35" r="3" fill="#FFF" opacity="0.8">
                <animate attributeName="opacity" values="0.8;0.2;0.8" dur="3s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>
          <h1>Uhuru Community Pixel Garden</h1>
          <p>Support the Uhuru Cultural Arts Institute's library and Watoto Kwanza Special Needs Facility by purchasing and customizing pixel tiles.</p>
          <button 
            id="startExploringBtn" 
            onClick={() => {
              const overlay = document.getElementById('welcomeOverlay');
              if (overlay) overlay.classList.add('hidden');
            }}
          >
            Start Exploring
          </button>
          <button id="mainBuyPotBtn" className="buy-pot-btn tip" data-tip="Get tokens!">Buy POT on pump.fun</button>
          <div className="project-info">
            <h2>About This Project</h2>
            <p>Each pixel you purchase becomes part of a vibrant community mural. Your contribution directly supports real-world community infrastructure.</p>
            <div className="impact-stats">
              <div className="stat">
                <span id="pixelsSold">0</span>
                <span>Pixels Sold</span>
              </div>
              <div className="stat">
                <span id="fundsRaised">$0</span>
                <span>Funds Raised</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <header>
        <div className="logo-small">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#4CAF50" />
            <path d="M30,50 Q50,20 70,50 T30,50" fill="#2E7D32" stroke="#FFF" strokeWidth="2" />
            <circle cx="50" cy="40" r="8" fill="#FF9800" />
          </svg>
        </div>
        <h1>Uhuru Community Pixel Garden</h1>
        <div className="actions">
          <button id="buyPotBtn" className="buy-pot-btn tip" data-tip="Get tokens!">Buy POT on pump.fun</button>
        </div>
      </header>

      <main>
        <div className="controls">
          <div className="zoom-controls">
            <button id="zoomIn">+</button>
            <button id="zoomOut">-</button>
            <button id="resetView">Reset View</button>
          </div>
          <div className="view-toggle">
            <button id="toggle2D" className="active">2D View</button>
            <button id="toggle3D">3D View</button>
          </div>
        </div>

        <div className="instructions">
          <h2>How to Play & Participate</h2>
          <ol>
            <li><span className="highlight">Browse the garden</span> in 2D or 3D view using the toggle buttons above.</li>
            <li><span className="highlight">Click any empty pixel</span> to customize and purchase it.</li>
            <li>Choose a <span className="highlight">color</span>, set a <span className="highlight">height</span> for 3D view, and add a <span className="highlight">personal message</span>.</li>
            <li>Follow the <span className="highlight">payment instructions</span> to complete your contribution.</li>
            <li>Double-click anywhere for a <span className="highlight">surprise!</span> Check out the meme corner for some pixel humor.</li>
            <li>Try switching between light and dark modes using the button at the bottom right!</li>
            <li>Your purchase directly supports the Uhuru Cultural Arts Institute's community initiatives!</li>
          </ol>
        </div>

        <div id="canvasContainer" style={{
          width: '100%',
          height: '600px',
          position: 'relative',
          backgroundColor: '#f0f0f0',
          margin: '20px 0'
        }}></div>

        <div id="pixelEditor" className="hidden">
          <h2>Customize Your Pixel</h2>
          <div className="editor-content">
            <div className="color-picker">
              <label htmlFor="pixelColor">Color:</label>
              <input type="color" id="pixelColor" defaultValue="#4CAF50" />
              <div className="image-upload-wrapper">
                <label htmlFor="pixelImage" className="image-upload-label">Or upload an image (512x512)</label>
                <input type="file" id="pixelImage" accept="image/*" className="hidden-file-input" />
                <button id="uploadImageBtn" className="upload-image-btn">Choose Image</button>
                <div id="imagePreview" className="image-preview hidden"></div>
                <button id="removeImageBtn" className="remove-image-btn hidden">Remove Image</button>
              </div>
            </div>
            <div className="height-slider">
              <label htmlFor="pixelHeight">Height (3D only) - Taller = More Expensive:</label>
              <input type="range" id="pixelHeight" min="1" max="10" defaultValue="1" />
              <small>Height 1: 10,000 POT → Height 10: 100,000 POT</small>
            </div>
            <div className="message-input">
              <label htmlFor="pixelMessage">Message:</label>
              <textarea id="pixelMessage" maxLength="100" placeholder="Add a short message..."></textarea>
            </div>
            <div className="owner-info">
              <label htmlFor="pixelOwnerName">Your Name (Optional):</label>
              <input type="text" id="pixelOwnerName" placeholder="Anonymous" />
              <label htmlFor="pixelOwnerEmail">Your Email (For updates, not displayed):</label>
              <input type="email" id="pixelOwnerEmail" placeholder="email@example.com" />
            </div>
            <div className="nft-info">
              <p>This pixel will become part of the community mural.</p>
              <p>Price: <span id="pixelPrice">10,000 POT</span></p>
            </div>
            <div className="editor-buttons">
              <button id="cancelEdit">Cancel</button>
              <button id="proceedToPayment">Proceed to Payment</button>
            </div>
          </div>
        </div>
      </main>

      <div id="pixelInfoPopup" className="popup hidden">
        <div className="popup-content">
          <span className="close-popup">&times;</span>
          <h3>Pixel Information</h3>
          <div id="pixelInfoContent"></div>
        </div>
      </div>

      <div id="transactionPopup" className="popup hidden">
        <div className="popup-content">
          <h3>Transaction in Progress</h3>
          <div className="spinner"></div>
          <p id="transactionStatus">Confirming transaction...</p>
        </div>
      </div>

      <div id="paymentPopup" className="popup hidden">
        <div className="popup-content">
          <span className="close-popup">&times;</span>
          <h3>Payment Instructions</h3>
          <div className="payment-instructions">
            <p>To purchase your pixel, please follow these steps:</p>
            <ol>
              <li>Send <strong><span id="paymentAmount">10,000</span></strong> POT tokens to this burn address:</li>
              <div className="burn-address">
                <code id="burnAddress">So1FuNcTio2Na411DrEsS29pLaCeHoLd3R</code>
                <button id="copyAddressBtn" className="copy-btn">Copy</button>
              </div>
              <li>Include this reference code in the transaction memo:</li>
              <div className="reference-code">
                <code id="paymentReference">PIXEL-ABC123</code>
                <button id="copyReferenceBtn" className="copy-btn">Copy</button>
              </div>
              <li>After sending payment, enter the transaction ID below:</li>
              <input type="text" id="transactionId" placeholder="Transaction ID/Hash" />
            </ol>
            <div className="payment-buttons">
              <button id="cancelPaymentBtn">Cancel</button>
              <button id="verifyPaymentBtn">Verify Payment</button>
            </div>
            <div className="payment-note">
              <p><strong>Note:</strong> Verification may take 1-2 minutes. Please keep this page open.</p>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <div className="footer-content">
          <div className="project-summary">
            <h3>Building Community Together</h3>
            <p>Each pixel purchased helps fund the Uhuru Cultural Arts Institute's community library and the Watoto Kwanza Special Needs Facility.</p>
          </div>
          <div className="social-links">
            <a href="#" className="social-icon">Twitter</a>
            <a href="#" className="social-icon">Discord</a>
            <a href="#" className="social-icon">Instagram</a>
            <a href="#" className="social-icon">GitHub</a>
          </div>
          <div className="project-stats">
            <div>Total Pixels: <span id="totalPixels">10,000</span></div>
            <div>Pixels Sold: <span id="soldPixelsCount">0</span></div>
            <div>Funds Raised: <span id="totalFundsRaised">$0</span></div>
          </div>
          <div className="copyright">
            &copy; 2023 Uhuru Technologies. All rights reserved.
          </div>
        </div>
      </footer>

      <Script type="module" src="/js/config.js" strategy="afterInteractive" />
      <Script type="module" src="/js/imageHandler.js" strategy="afterInteractive" />
      <Script type="module" src="/js/paymentHandler.js" strategy="afterInteractive" />
      <Script type="module" src="/js/pixelGrid.js" strategy="afterInteractive" />
      <Script type="module" src="/js/pixel-utils.js" strategy="afterInteractive" />
      <Script type="module" src="/js/main.js" strategy="afterInteractive" />
    </>
  );
}