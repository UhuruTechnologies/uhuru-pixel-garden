// Pixel model schema for MongoDB
import mongoose from 'mongoose';

// Define a schema
const PixelSchema = new mongoose.Schema({
  x: {
    type: Number,
    required: true,
  },
  y: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  height: {
    type: Number,
    required: true,
    default: 1,
  },
  message: {
    type: String,
    maxlength: 100,
  },
  owner: {
    type: String,
    default: 'Anonymous',
  },
  email: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  transactionId: {
    type: String,
    required: true,
  },
  paymentReference: {
    type: String,
    required: true,
  },
});

// Create a compound index for x and y to ensure uniqueness
PixelSchema.index({ x: 1, y: 1 }, { unique: true });

// Use mongoose.models to check if the model exists already or create a new one
export default mongoose.models.Pixel || mongoose.model('Pixel', PixelSchema);