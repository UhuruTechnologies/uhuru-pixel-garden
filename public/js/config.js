// Configuration for the Uhuru Community Pixel Garden
// Simple global variable approach to avoid module loading issues

// Define the global config object
window.config = {
    // Grid configuration
    grid: {
        width: 100,      // Number of pixels in width
        height: 100,     // Number of pixels in height
        pixelSize: 10,   // Size of each pixel in px
    },
    
    // Payment configuration
    payment: {
        // Using a designated Solana burn address - tokens sent here are effectively burned
        burnAddress: "1111111111111111111111111111111111111111111", // Solana's designated burn address
        pricePerPixel: 10000, // Base price in POT tokens
        additionalPricePerHeight: 10000, // Additional price per height level
    },
    
    // Project details
    project: {
        name: "Uhuru Community Pixel Garden",
        description: "A community-driven digital mural supporting the Uhuru Cultural Arts Institute",
        fundingGoal: 100000, // Goal in USD
        
        // Fund allocation percentages
        allocation: {
            library: 60, // 60% to community library
            specialNeeds: 40 // 40% to Watoto Kwanza Special Needs Facility
        }
    },
    
    // 3D view settings
    view3D: {
        maxHeight: 10,  // Maximum height for 3D pixels
        defaultHeight: 1, // Default height for new pixels
        cameraDistance: 400,
        ambientLightIntensity: 0.5,
        directionalLightIntensity: 0.8
    }
};