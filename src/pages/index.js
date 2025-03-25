import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import dynamic from 'next/dynamic';

// Import the PixelGrid client component with dynamic import
const PixelGridClient = dynamic(() => import('../components/PixelGridClient'), {
  ssr: false // Disable server-side rendering for this component
});

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Set initial dark mode based on system preference
    setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);

  const handleStartExploring = () => {
    const welcomeOverlay = document.getElementById('welcomeOverlay');
    if (welcomeOverlay) {
      welcomeOverlay.classList.add('hidden');
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  };

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
      </Head>

      {/* Theme Toggle Button */}
      <button 
        onClick={toggleTheme} 
        className="theme-toggle" 
        aria-label="Toggle dark/light mode"
      >
        <svg 
          id="moonIcon" 
          style={{ display: isDarkMode ? 'none' : 'block' }}
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M12 11.807A9.002 9.002 0 0 1 10.049 2a9.942 9.942 0 0 0-5.12 2.735c-3.905 3.905-3.905 10.237 0 14.142 3.906 3.906 10.237 3.905 14.143 0a9.946 9.946 0 0 0 2.735-5.119A9.003 9.003 0 0 1 12 11.807z"></path>
        </svg>
        <svg 
          id="sunIcon" 
          style={{ display: isDarkMode ? 'block' : 'none' }}
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"></path>
        </svg>
      </button>

      <div className="overlay" id="welcomeOverlay">
        <div className="connect-container">
          {/* ... Welcome overlay content ... */}
          <button onClick={handleStartExploring}>
            Start Exploring
          </button>
        </div>
      </div>

      <header>
        <div className="logo-small">
          {/* ... Logo SVG ... */}
        </div>
        <h1>Uhuru Community Pixel Garden</h1>
        <div className="actions">
          <button 
            className="buy-pot-btn tip" 
            data-tip="Get tokens!"
            onClick={() => window.open('https://pump.fun', '_blank')}
          >
            Buy POT on pump.fun
          </button>
        </div>
      </header>

      <main>
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

        <PixelGridClient />

        {/* ... Rest of your components (pixel editor, popups, etc.) ... */}
      </main>

      <footer>
        {/* ... Footer content ... */}
      </footer>

      {/* Load required scripts */}
      <Script type="module" src="/js/config.js" strategy="afterInteractive" />
      <Script type="module" src="/js/imageHandler.js" strategy="afterInteractive" />
      <Script type="module" src="/js/paymentHandler.js" strategy="afterInteractive" />
      <Script type="module" src="/js/pixelGrid.js" strategy="afterInteractive" />
      <Script type="module" src="/js/pixel-utils.js" strategy="afterInteractive" />
      <Script type="module" src="/js/main.js" strategy="afterInteractive" />
    </>
  );
} 