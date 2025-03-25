// Handles payment verification and MongoDB interactions

class PaymentHandlerClass {
    constructor() {
        this.currentPayment = null;
        this.apiEndpoint = '/api'; // Base API endpoint
    }
    
    initialize() {
        // Initialize payment handler
        console.log("Payment handler initialized");
    }
    
    setCurrentPayment(paymentDetails) {
        this.currentPayment = paymentDetails;
    }
    
    getCurrentPayment() {
        return this.currentPayment;
    }
    
    async verifyPayment(transactionId) {
        if (!this.currentPayment) {
            return { success: false, error: "No active payment to verify" };
        }
        
        try {
            // Call the backend API to verify the transaction
            const response = await fetch(`${this.apiEndpoint}/verify-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    transactionId,
                    paymentReference: this.currentPayment.paymentReference,
                    pixelDetails: {
                        x: this.currentPayment.x,
                        y: this.currentPayment.y,
                        color: this.currentPayment.color,
                        height: this.currentPayment.height,
                        message: this.currentPayment.message,
                        owner: this.currentPayment.ownerName,
                        email: this.currentPayment.ownerEmail
                    }
                }),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                return {
                    success: false,
                    error: errorData.message || "Error verifying payment"
                };
            }
            
            const result = await response.json();
            return result;
            
        } catch (error) {
            console.error("Error verifying payment:", error);
            return {
                success: false,
                error: "Error verifying payment: " + error.message
            };
        }
    }
    
    async getProjectStats() {
        try {
            // Fetch stats from the API
            const response = await fetch(`${this.apiEndpoint}/stats`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch stats');
            }
            
            const stats = await response.json();
            return stats;
            
        } catch (error) {
            console.error("Error getting project stats:", error);
            return {
                totalPixels: 10000,
                pixelsSold: 0,
                fundsRaised: 0
            };
        }
    }
    
    async getAllPixels() {
        try {
            // Fetch all pixels from the API
            const response = await fetch(`${this.apiEndpoint}/pixels`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch pixels');
            }
            
            const pixels = await response.json();
            return pixels;
            
        } catch (error) {
            console.error("Error fetching pixels:", error);
            return [];
        }
    }
}

// Create and export a singleton instance
export const PaymentHandler = new PaymentHandlerClass();