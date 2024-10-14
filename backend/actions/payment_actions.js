import dotenv from 'dotenv';
dotenv.config();

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  let { totalAmount } = req.body;

  totalAmount = parseFloat(totalAmount);
  
  if (isNaN(totalAmount) || totalAmount <= 0) {
    return res.status(400).json({ error: 'El totalAmount debe ser un número positivo.' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: 'eur',
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Detalles del error:', error);
    console.error('Error creando PaymentIntent:', error); 
      res.status(500).json({ error: error.message });

  }
};