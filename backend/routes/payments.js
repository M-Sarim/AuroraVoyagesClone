import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { auth } from '../middleware/auth.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

const router = express.Router();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create payment intent
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { amount, currency = 'usd', bookingData } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid payment amount' });
    }

    // Determine booking type
    const bookingType = bookingData?.bookingType || 'package';

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        userId: req.user.id,
        bookingId: bookingData?.id || 'new-booking',
        bookingType: bookingType,
        description: bookingData?.description ||
          (bookingType === 'destination' ? 'Destination Booking' : 'Vacation Package Booking')
      },
      receipt_email: bookingData?.email
    });

    res.status(200).json(paymentIntent.client_secret);
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ message: 'Server error during payment intent creation' });
  }
});

// Webhook for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;

      // Update booking status if bookingId is provided
      if (paymentIntent.metadata.bookingId && paymentIntent.metadata.bookingId !== 'new-booking') {
        try {
          const booking = await Booking.findById(paymentIntent.metadata.bookingId);

          if (booking) {
            booking.paymentStatus = 'paid';
            booking.status = 'confirmed';
            await booking.save();

            // Get booking type from metadata
            const bookingType = paymentIntent.metadata.bookingType || 'package';
            const bookingDescription = bookingType === 'destination' ? 'destination booking' : 'vacation package';

            // Send notification to user if Socket.IO is available
            if (req.io) {
              const userId = paymentIntent.metadata.userId;
              req.io.to(userId).emit('booking_update', {
                id: booking._id,
                status: 'confirmed',
                bookingType,
                message: `Your ${bookingDescription} has been confirmed`
              });
            }

            // Send email confirmation
            try {
              // Email confirmation logic would go here
              console.log(`Payment confirmation email would be sent for ${bookingDescription} ID: ${booking._id}`);
            } catch (emailErr) {
              console.error('Error sending confirmation email:', emailErr);
            }
          }
        } catch (err) {
          console.error('Error updating booking after payment:', err);
        }
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);

      // Notify user of failed payment if possible
      if (req.io && failedPayment.metadata.userId) {
        req.io.to(failedPayment.metadata.userId).emit('payment_failed', {
          paymentId: failedPayment.id,
          message: 'Your payment was unsuccessful. Please try again or use a different payment method.'
        });
      }
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true });
});

// Get payment history for user
router.get('/history', auth, async (req, res) => {
  try {
    // Get user's bookings with payment information
    const bookings = await Booking.find({
      user: req.user.id,
      paymentStatus: { $in: ['paid', 'refunded'] }
    })
    .populate('vacationPackage', 'name price')
    .populate('destination', 'name')
    .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({ message: 'Server error while fetching payment history' });
  }
});

// Request refund
router.post('/refund/:bookingId', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      user: req.user.id,
      paymentStatus: 'paid'
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or not eligible for refund' });
    }

    // Check if booking is within refund period (e.g., 24 hours before start date)
    const startDate = new Date(booking.startDate);
    const now = new Date();
    const hoursUntilStart = (startDate - now) / (1000 * 60 * 60);

    if (hoursUntilStart < 24) {
      return res.status(400).json({
        message: 'Refunds must be requested at least 24 hours before the start date'
      });
    }

    // Update booking status
    booking.paymentStatus = 'refund_requested';
    await booking.save();

    // Send notification to admin
    if (req.io) {
      // Find admin users
      const admins = await User.find({ role: 'admin' });

      // Send notification to each admin
      admins.forEach(admin => {
        req.io.to(admin._id.toString()).emit('refund_request', {
          bookingId: booking._id,
          userId: req.user.id,
          amount: booking.totalPrice
        });
      });
    }

    res.status(200).json({
      message: 'Refund request submitted successfully',
      booking
    });
  } catch (error) {
    console.error('Refund request error:', error);
    res.status(500).json({ message: 'Server error during refund request' });
  }
});

export default router;
