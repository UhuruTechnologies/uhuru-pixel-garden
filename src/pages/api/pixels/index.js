// API route to handle pixel data requests
import connectMongo from '../../../server/db/mongodb';
import Pixel from '../../../models/Pixel';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGODB_URI);

  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      try {
        // Get all pixels
        const pixels = await Pixel.find({});
        res.status(200).json(pixels);
      } catch (error) {
        console.error('Error fetching pixels:', error);
        res.status(500).json({ error: 'Failed to fetch pixels' });
      }
      break;
      
    case 'POST':
      try {
        // Create a new pixel
        const pixel = new Pixel(req.body);
        await pixel.save();
        res.status(201).json(pixel);
      } catch (error) {
        console.error('Error creating pixel:', error);
        res.status(500).json({ error: 'Failed to create pixel' });
      }
      break;
      
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}