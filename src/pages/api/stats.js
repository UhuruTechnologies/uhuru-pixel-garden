// API route to get project statistics
import mongoose from 'mongoose';
import Pixel from '../../models/Pixel';
import { config } from '../../client/js/config';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    // Get count of pixels sold
    const pixelsSold = await Pixel.countDocuments({});
    
    // Calculate total pixels available
    const totalPixels = config.grid.width * config.grid.height;
    
    // Calculate funds raised (in theory - this would be more complex in reality)
    // For simplicity, assuming 1 POT = $0.01 USD
    const pixels = await Pixel.find({});
    let potTokensRaised = 0;
    
    pixels.forEach(pixel => {
      potTokensRaised += config.payment.pricePerPixel + 
                         (pixel.height - 1) * config.payment.additionalPricePerHeight;
    });
    
    // Convert to USD (assuming 1 POT = $0.01)
    const fundsRaised = potTokensRaised * 0.01;
    
    res.status(200).json({
      totalPixels,
      pixelsSold,
      potTokensRaised,
      fundsRaised
    });
    
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
}