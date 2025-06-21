const webhookValidator = require('../validator/webhookValidator');
const webhookProvider = require('../provider/webhookProvider');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const handleStripeWebhook = async (req, res) => {
    try {
        console.log("Stripe Webhook Controller :::");

        const sig = req.headers['stripe-signature'];
        const event = webhookValidator.validateStripeSignature(req.body, sig);

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            await webhookProvider.processCheckoutSession(session);
        }

        return res.json({ received: true });

    } catch (err) {
        console.error("Error in Stripe Webhook Controller ::", err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
};

module.exports = {
    handleStripeWebhook
};
