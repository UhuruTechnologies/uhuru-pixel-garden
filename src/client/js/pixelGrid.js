import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { config } from './config.js';

export class PixelGrid {
    constructor(container) {
        this.container = container;
        this.width = config.grid.width;
        this.height = config.grid.height;
        this.pixelSize = config.grid.pixelSize;
        this.pixels = new Array(this.width * this.height).fill(null);
        this.selectedPixel = null;
        
        // Mode tracking
        this.is3DMode = false;
        
        // Zoom scale
        this.zoomScale = 1;
        
        // Initialize both renderers
        this.initCanvas();
        this.init3D();
        
        // Event handlers
        this.onPixelClickHandlers = [];
        this.setupEventListeners();
    }
    
    initCanvas() {
        // Create 2D canvas
        this.canvas = document.createElement('canvas');
        this.canvasBaseWidth = this.width * this.pixelSize;
        this.canvasBaseHeight = this.height * this.pixelSize;
        this.canvas.width = this.canvasBaseWidth;
        this.canvas.height = this.canvasBaseHeight;
        this.ctx = this.canvas.getContext('2d');
        
        // Add canvas to container
        this.canvas.style.display = 'block';
        this.container.appendChild(this.canvas);
        
        // Draw initial grid
        this.drawGrid();
    }
    
    init3D() {
        // Setup THREE.js scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);
        
        // Camera
        const aspectRatio = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 2000);
        this.camera.position.set(0, 200, 400);
        this.camera.lookAt(0, 0, 0);
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer3DContainer = document.createElement('div');
        this.renderer3DContainer.style.display = 'none'; // Hide initially
        this.renderer3DContainer.appendChild(this.renderer.domElement);
        this.container.appendChild(this.renderer3DContainer);
        
        // Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.1;
        
        // Lighting
        this.addLights();
        
        // Ground plane
        this.addGroundPlane();
        
        // Grid helper
        const gridHelper = new THREE.GridHelper(
            this.width * this.pixelSize, 
            this.width,
            0x888888,
            0xcccccc
        );
        gridHelper.position.y = 0.1; // Slightly above ground to avoid z-fighting
        this.scene.add(gridHelper);
        
        // Start render loop
        this.animate();
    }
    
    addLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(
            0xffffff, 
            config.view3D.ambientLightIntensity
        );
        this.scene.add(ambientLight);
        
        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(
            0xffffff, 
            config.view3D.directionalLightIntensity
        );
        directionalLight.position.set(200, 300, 200);
        directionalLight.castShadow = true;
        
        // Adjust shadow camera to fit the scene
        const d = 300;
        directionalLight.shadow.camera.left = -d;
        directionalLight.shadow.camera.right = d;
        directionalLight.shadow.camera.top = d;
        directionalLight.shadow.camera.bottom = -d;
        directionalLight.shadow.camera.near = 100;
        directionalLight.shadow.camera.far = 800;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        
        this.scene.add(directionalLight);
    }
    
    addGroundPlane() {
        const planeGeometry = new THREE.PlaneGeometry(
            this.width * this.pixelSize,
            this.height * this.pixelSize
        );
        const planeMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.8,
            metalness: 0.2,
            side: THREE.DoubleSide
        });
        this.groundPlane = new THREE.Mesh(planeGeometry, planeMaterial);
        this.groundPlane.rotation.x = -Math.PI / 2;
        this.groundPlane.receiveShadow = true;
        this.scene.add(this.groundPlane);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.is3DMode) {
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    drawGrid() {
        // Clear canvas
        this.ctx.fillStyle = '#f0f0f0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid lines
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x <= this.width; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.pixelSize, 0);
            this.ctx.lineTo(x * this.pixelSize, this.height * this.pixelSize);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= this.height; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.pixelSize);
            this.ctx.lineTo(this.width * this.pixelSize, y * this.pixelSize);
            this.ctx.stroke();
        }
        
        // Draw all pixels
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const index = y * this.width + x;
                const pixel = this.pixels[index];
                if (pixel) {
                    this.drawPixel2D(x, y, pixel.color);
                }
            }
        }
        
        // Highlight selected pixel if any
        if (this.selectedPixel) {
            const { x, y } = this.selectedPixel;
            this.highlightPixel(x, y);
        }
    }
    
    drawPixel2D(x, y, color) {
        const padding = 1; // Small padding for visual clarity
        this.ctx.fillStyle = color || '#cccccc';
        
        // Check if color is actually an image data URL
        if (color && color.startsWith('data:image')) {
            const img = new Image();
            img.onload = () => {
                this.ctx.drawImage(
                    img,
                    x * this.pixelSize + padding,
                    y * this.pixelSize + padding,
                    this.pixelSize - padding * 2,
                    this.pixelSize - padding * 2
                );
            };
            img.src = color;
        } else {
            this.ctx.fillRect(
                x * this.pixelSize + padding,
                y * this.pixelSize + padding,
                this.pixelSize - padding * 2,
                this.pixelSize - padding * 2
            );
        }
    }
    
    highlightPixel(x, y) {
        this.ctx.strokeStyle = '#ff5722';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(
            x * this.pixelSize + 2,
            y * this.pixelSize + 2,
            this.pixelSize - 4,
            this.pixelSize - 4
        );
    }
    
    addPixel3D(x, y, pixelData) {
        // Calculate position
        const posX = (x - this.width / 2) * this.pixelSize + this.pixelSize / 2;
        const posZ = (y - this.height / 2) * this.pixelSize + this.pixelSize / 2;
        const posY = (pixelData.height || 1) * this.pixelSize / 2;
        
        // Create geometry
        const geometry = new THREE.BoxGeometry(
            this.pixelSize - 1,
            pixelData.height * this.pixelSize,
            this.pixelSize - 1
        );
        
        // Create material
        let material;
        
        // Check if color is actually an image data URL
        if (pixelData.color && pixelData.color.startsWith('data:image')) {
            // Create texture from image
            const texture = new THREE.TextureLoader().load(pixelData.color);
            material = new THREE.MeshStandardMaterial({
                map: texture,
                roughness: 0.7,
                metalness: 0.3
            });
        } else {
            material = new THREE.MeshStandardMaterial({
                color: new THREE.Color(pixelData.color || '#cccccc'),
                roughness: 0.7,
                metalness: 0.3
            });
        }
        
        // Create mesh
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(posX, posY, posZ);
        cube.castShadow = true;
        cube.receiveShadow = true;
        
        // Store reference to the mesh in pixelData
        pixelData.mesh = cube;
        
        // Store pixel data for 3D object
        cube.userData = {
            pixelX: x,
            pixelY: y,
            pixelData: pixelData
        };
        
        // Add to scene
        this.scene.add(cube);
    }
    
    removePixel3D(pixelData) {
        if (pixelData && pixelData.mesh) {
            this.scene.remove(pixelData.mesh);
            pixelData.mesh.geometry.dispose();
            pixelData.mesh.material.dispose();
            pixelData.mesh = null;
        }
    }
    
    setPixel(x, y, pixelData) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            console.error('Pixel coordinates out of bounds:', x, y);
            return false;
        }
        
        const index = y * this.width + x;
        
        // Remove existing 3D object if it exists
        if (this.pixels[index] && this.pixels[index].mesh) {
            this.removePixel3D(this.pixels[index]);
        }
        
        // Update pixel data
        this.pixels[index] = {
            ...pixelData,
            x,
            y
        };
        
        // Add 3D representation
        this.addPixel3D(x, y, this.pixels[index]);
        
        // Redraw 2D grid
        this.drawGrid();
        
        return true;
    }
    
    getPixel(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return null;
        }
        
        const index = y * this.width + x;
        return this.pixels[index];
    }
    
    setMode(mode3D) {
        this.is3DMode = mode3D;
        
        if (mode3D) {
            // Switch to 3D view
            this.canvas.style.display = 'none';
            this.renderer3DContainer.style.display = 'block';
            
            // Make sure renderer size is correct
            this.updateRendererSize();
        } else {
            // Switch to 2D view
            this.canvas.style.display = 'block';
            this.renderer3DContainer.style.display = 'none';
            
            // Redraw the 2D grid to ensure it's up to date
            this.drawGrid();
        }
    }
    
    updateRendererSize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        // Update 3D renderer
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        
        // Update 2D canvas display (keep internal resolution but adjust display size)
        const aspectRatio = this.canvasBaseWidth / this.canvasBaseHeight;
        let displayWidth, displayHeight;
        
        if (width / height > aspectRatio) {
            // Container is wider than canvas aspect ratio
            displayHeight = Math.min(height, this.canvasBaseHeight);
            displayWidth = displayHeight * aspectRatio;
        } else {
            // Container is taller than canvas aspect ratio
            displayWidth = Math.min(width, this.canvasBaseWidth);
            displayHeight = displayWidth / aspectRatio;
        }
        
        // Apply size while maintaining aspect ratio
        this.canvas.style.width = `${displayWidth}px`;
        this.canvas.style.height = `${displayHeight}px`;
    }
    
    resetView() {
        if (this.is3DMode) {
            // Reset camera position in 3D mode
            this.camera.position.set(0, 200, 400);
            this.camera.lookAt(0, 0, 0);
            this.controls.reset();
        } else {
            // In 2D mode, just redraw
            this.drawGrid();
        }
    }
    
    setupEventListeners() {
        // Canvas click for 2D mode
        this.canvas.addEventListener('click', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            
            const x = Math.floor((event.clientX - rect.left) * scaleX / this.pixelSize);
            const y = Math.floor((event.clientY - rect.top) * scaleY / this.pixelSize);
            
            this.handlePixelClick(x, y);
        });
        
        // Three.js raycasting for 3D mode
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        this.renderer.domElement.addEventListener('click', (event) => {
            const rect = this.renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            raycaster.setFromCamera(mouse, this.camera);
            
            const intersects = raycaster.intersectObjects(this.scene.children);
            
            // Check if we hit a pixel
            for (const intersect of intersects) {
                if (intersect.object.userData && intersect.object.userData.pixelX !== undefined) {
                    const { pixelX, pixelY } = intersect.object.userData;
                    this.handlePixelClick(pixelX, pixelY);
                    break;
                }
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.updateRendererSize();
        });
    }
    
    handlePixelClick(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return;
        }
        
        // Update selected pixel
        this.selectedPixel = { x, y };
        
        // Redraw grid to show highlight in 2D mode
        if (!this.is3DMode) {
            this.drawGrid();
        }
        
        // Call all registered click handlers
        for (const handler of this.onPixelClickHandlers) {
            handler(x, y, this.getPixel(x, y));
        }
    }
    
    onPixelClick(handler) {
        this.onPixelClickHandlers.push(handler);
    }
    
    loadPixelData(pixelsData) {
        // Clear existing pixels
        for (let i = 0; i < this.pixels.length; i++) {
            if (this.pixels[i] && this.pixels[i].mesh) {
                this.removePixel3D(this.pixels[i]);
            }
        }
        
        this.pixels = new Array(this.width * this.height).fill(null);
        
        // Load new pixels
        for (const pixel of pixelsData) {
            this.setPixel(pixel.x, pixel.y, pixel);
        }
        
        // Redraw
        this.drawGrid();
    }
    
    setZoom(scale) {
        this.zoomScale = scale;
        
        if (this.is3DMode) {
            // In 3D mode, adjust camera
            this.camera.position.z = 400 / scale;
            this.camera.updateProjectionMatrix();
        } else {
            // In 2D mode, resize canvas
            this.canvas.style.transform = `scale(${scale})`;
            this.canvas.style.transformOrigin = 'center center';
            // Redraw for smoother rendering
            this.drawGrid();
        }
    }
}