import dynamic from 'next/dynamic';

// Import the PixelGrid client component with dynamic import to prevent SSR
const PixelGridClient = dynamic(() => import('../components/PixelGridClient'), {
  ssr: false, // Disable server-side rendering for this component
});

export default function Home() {
  return (
    <main>
      <header className="header">
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
      
      {/* Render the client component with the pixel grid */}
      <PixelGridClient />
      
      {/* Additional components like pixel editor, popups, etc. */}
      {/* These would be implemented as separate React components */}
      
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
            <div>Pixels Sold: <span id="soldPixelsCount">464</span></div>
            <div>Funds Raised: <span id="totalFundsRaised">$5,286</span></div>
          </div>
          <div className="copyright">
            &copy; 2023 Uhuru Technologies. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}