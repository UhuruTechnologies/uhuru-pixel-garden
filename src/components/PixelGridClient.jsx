'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function PixelGridClient() {
  const containerRef = useRef(null);
  const [pixelGrid, setPixelGrid] = useState(null);
  const [is3DMode, setIs3DMode] = useState(false);
  const [currentZoomScale, setCurrentZoomScale] = useState(1);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Import PixelGrid dynamically since it uses browser APIs
    const initializeGrid = async () => {
      try {
        // Wait for the window object to be available
        if (typeof window !== 'undefined') {
          // Wait for THREE.js to be loaded
          while (!window.THREE) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
          // Initialize PixelGrid
          const grid = new window.PixelGrid(containerRef.current);
          setPixelGrid(grid);
          
          // Load mock data
          const mockPixels = [
            {
              x: 45, y: 45, color: '#FF9800', height: 3,
              message: 'Uhuru Cultural Arts Institute',
              owner: 'John Doe', timestamp: Date.now() - 86400000 * 5
            },
            {
              x: 46, y: 45, color: '#4CAF50', height: 2,
              message: 'Supporting our community!',
              owner: 'Jane Doe', timestamp: Date.now() - 86400000 * 3
            }
          ];
          
          grid.loadPixelData(mockPixels);
        }
      } catch (error) {
        console.error('Error initializing PixelGrid:', error);
      }
    };
    
    initializeGrid();
    
    // Cleanup on unmount
    return () => {
      if (pixelGrid) {
        // Remove event listeners and clean up THREE.js resources
        window.removeEventListener('resize', pixelGrid.updateRendererSize);
        if (pixelGrid.renderer) {
          pixelGrid.renderer.dispose();
        }
        if (pixelGrid.scene) {
          pixelGrid.scene.traverse((object) => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          });
        }
      }
    };
  }, []);
  
  // View toggle handlers
  const toggle2D = () => {
    if (pixelGrid) {
      pixelGrid.setMode(false);
      setIs3DMode(false);
    }
  };
  
  const toggle3D = () => {
    if (pixelGrid) {
      pixelGrid.setMode(true);
      setIs3DMode(true);
    }
  };
  
  // Zoom handlers
  const zoomIn = () => {
    if (pixelGrid) {
      const newScale = Math.min(currentZoomScale + 0.1, 2.0);
      setCurrentZoomScale(newScale);
      pixelGrid.setZoom(newScale);
    }
  };
  
  const zoomOut = () => {
    if (pixelGrid) {
      const newScale = Math.max(currentZoomScale - 0.1, 0.5);
      setCurrentZoomScale(newScale);
      pixelGrid.setZoom(newScale);
    }
  };
  
  const resetView = () => {
    if (pixelGrid) {
      setCurrentZoomScale(1);
      pixelGrid.resetView();
    }
  };
  
  return (
    <div className="pixel-grid-wrapper">
      <div className="controls">
        <div className="zoom-controls">
          <button onClick={zoomIn}>+</button>
          <button onClick={zoomOut}>-</button>
          <button onClick={resetView}>Reset View</button>
        </div>
        <div className="view-toggle">
          <button 
            onClick={toggle2D} 
            className={!is3DMode ? "active" : ""}
          >
            2D View
          </button>
          <button 
            onClick={toggle3D} 
            className={is3DMode ? "active" : ""}
          >
            3D View
          </button>
        </div>
      </div>
      
      <div 
        ref={containerRef} 
        className="canvas-container" 
        style={{
          width: '100%',
          minHeight: '500px',
          position: 'relative',
          backgroundColor: '#f0f0f0',
          marginTop: '20px',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      ></div>
    </div>
  );
} 