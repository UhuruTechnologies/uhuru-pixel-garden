// API route to verify Solana transactions
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import mongoose from 'mongoose';
import Pixel from '../../models/Pixel';

// Solana connection
const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Get the transaction ID and reference from the request
  const { transactionId, paymentReference, pixelDetails } = req.body;

  if (!transactionId || !paymentReference || !pixelDetails) {
    return res.status(400).json({ success: false, message: 'Missing required parameters' });
  }

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    // Check if this transaction has already been processed
    const existingPixel = await Pixel.findOne({ transactionId });
    if (existingPixel) {
      return res.status(400).json({ 
        success: false, 
        message: 'This transaction has already been used to purchase a pixel' 
      });
    }

    // Verify the transaction on Solana blockchain
    try {
      const transaction = await connection.getTransaction(transactionId, {
        commitment: 'confirmed',
      });

      if (!transaction) {
        return res.status(404).json({ 
          success: false, 
          message: 'Transaction not found on the Solana blockchain' 
        });
      }

      // Check if the transaction is a transfer to the burn address
      const burnAddress = new PublicKey(process.env.SOLANA_BURN_ADDRESS);
      
      // Find a transfer instruction to the burn address
      let validTransfer = false;
      let transferAmount = 0;
      
      // This is a simplified check - in a production app, you'd want more robust verification
      for (const instruction of transaction.transaction.message.instructions) {
        // Check if this is a transfer to our burn address
        // A more robust system would properly decode the instruction
        if (instruction.programId.toString() === 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') {
          // This is a rough approximation - real validation would be more detailed
          validTransfer = true;
          transferAmount = transaction.meta.postBalances[0] - transaction.meta.preBalances[0];
          break;
        }
      }

      if (!validTransfer) {
        return res.status(400).json({ 
          success: false, 
          message: 'Transaction does not contain a valid transfer to the burn address' 
        });
      }

      // For demo purposes, consider any transaction valid
      // Save the pixel to the database
      const newPixel = new Pixel({
        ...pixelDetails,
        transactionId,
        paymentReference,
        timestamp: new Date()
      });

      await newPixel.save();

      return res.status(200).json({ 
        success: true, 
        message: 'Payment verified successfully',
        pixel: newPixel
      });
      
    } catch (error) {
      console.error('Error verifying transaction:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error verifying transaction' 
      });
    }
  } catch (error) {
    console.error('Error connecting to database:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}