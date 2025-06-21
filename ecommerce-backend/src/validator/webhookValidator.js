require('dotenv').config(); // Optional safeguard

const stripeLib = require('stripe');

const validateStripeSignature = (rawBody, signature) => {
    try {
        const stripe = stripeLib(process.env.STRIPE_SECRET_KEY); // 👈 Lazy init
        return stripe.webhooks.constructEvent(
            rawBody,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error("Stripe Signature Validation Error:", error);
        throw error;
    }
};

module.exports = {
    validateStripeSignature,
};
