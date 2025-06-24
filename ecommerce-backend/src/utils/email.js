const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '*****' : 'not set');

console.log("Current DB URL:", process.env.DATABASE_URL);
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendOrderConfirmation = async (to, orderData) => {
  const { total, currency = 'USD', trackingNumber = '', orderId = '' } = orderData;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject: '🧴 Your Skincare Order Confirmation',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
                   Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                   background-color: #f9f9f9; padding: 30px; color: #333;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; box-shadow: 0 0 12px rgba(0,0,0,0.1); padding: 30px;">
          <h1 style="color: #4CAF50; margin-bottom: 20px;">Thank You for Your Order!</h1>
          <p style="font-size: 16px; line-height: 1.5;">
            Hi there,
          </p>
          <p style="font-size: 16px; line-height: 1.5;">
            We're excited to let you know that your skincare order has been confirmed. We’re preparing it with care and will notify you when it’s shipped.
          </p>
          <div style="border: 1px solid #eee; padding: 20px; border-radius: 6px; margin: 20px 0; background-color: #fefefe;">
            <p style="margin: 0; font-weight: 600;">Order ID: <span style="color: #555;">${orderId || 'N/A'}</span></p>
            <p style="margin: 0; font-weight: 600;">Order Total: <span style="color: #555;">${(total / 100).toFixed(2)} ${currency}</span></p>
            <p style="margin: 0; font-weight: 600;">Tracking Number: <span style="color: #555;">${trackingNumber || 'Coming Soon'}</span></p>
          </div>
          <p style="font-size: 16px; line-height: 1.5;">
            You’ll receive another email once your order ships, including tracking information so you can follow it every step of the way.
          </p>
         <div style="text-align: center; margin: 30px 0;">
  <a href="http://localhost:3000/orders"
     target="_blank"
     rel="noopener noreferrer"
     style="
       background-color: #4CAF50;
       color: white;
       padding: 12px 24px;
       text-decoration: none;
       font-size: 16px;
       border-radius: 6px;
       display: inline-block;
       font-weight: 600;
       transition: background-color 0.3s ease;
     ">
    View Your Orders
  </a>
</div>

          <p style="margin-top: 30px; font-size: 14px; color: #777;">
            If you have any questions, reply to this email or contact our support team at
            <a href="mailto:support@yourcompany.com" style="color: #4CAF50;">support@yourcompany.com</a>.
          </p>
          <hr style="margin: 30px 0; border-color: #eee;">
          <p style="font-size: 12px; color: #aaa; text-align: center;">
            This is an automated message, please do not reply.<br>
            Your Company Name &bull; 123 Your Street, City, Country
          </p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  transporter,
  sendOrderConfirmation,
};
