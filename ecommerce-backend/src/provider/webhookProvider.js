// import { sendOrderConfirmation } from '../utils/email.js'
const { sendOrderConfirmation } = require("../utils/email");
const prisma = require('../prisma');// Adjust based on your project structure

const processCheckoutSession = async (session) => {
    try {
        const userId = parseInt(session.metadata?.userId);
        const cartItems = JSON.parse(session.metadata?.cart || '[]');

        const order = await prisma.order.create({
            data: {
                stripeSessionId: session.id,
                userId: userId,
                customerEmail: session.customer_details.email,
                amountTotal: session.amount_total,
                currency: session.currency,
                status: 'paid',
                paymentStatus: session.payment_status,
                items: {
                    create: cartItems.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price, // assuming item.price is unit price
                    })),
                },
            },
            include: {
                items: true,
            },
        });

        const user = await prisma.user.findUnique({ where: { id: userId } })
if (user?.email) {
  await sendOrderConfirmation(user.email, {
    total: session.amount_total / 100,
    trackingNumber: '',
  })
}


        console.log("✅ Order created from checkout session:", order.id);
    } catch (error) {
        console.error("❌ Error processing checkout session:", error);
        throw error;
    }
};


module.exports = {
    processCheckoutSession
};
