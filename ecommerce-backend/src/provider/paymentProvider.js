const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const prisma = require('../prisma');

const createCheckoutSessionProvider = async (data) => {
  try {
    const { shipping, cartItems } = data;  // ✅ FIXED

    const cartSummary = cartItems
      .map(item => `${item.id}x${item.quantity}`)
      .join(',');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: cartItems.map(item => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.name,
            images: item.imageUrl,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      metadata: {
        email: shipping.email,
        name: shipping.name,
        phone: shipping.phone,
        cartSummary,
      },
      success_url: `https://skincare-ecommerce-website.vercel.app/orders`,
      cancel_url: `https://skincare-ecommerce-website.vercel.app`,
    });

    return { url: session.url };  // ✅ Also fixed: returning instead of using `res.json(...)`
  } catch (error) {
    console.error('Error in createCheckoutSessionProvider :: ', error);
    throw error;  // ✅ Rethrow to be handled in controller
  }
};



  

module.exports = {
    createCheckoutSessionProvider,
};