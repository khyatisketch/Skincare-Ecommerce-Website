const cron = require('node-cron');
const axios = require('axios');

// Ping your own Render backend every 5 minutes
const KEEP_ALIVE_URL = 'https://skincare-ecommerce-website.onrender.com';

const startKeepAlivePing = () => {
  cron.schedule('*/5 * * * *', async () => {
    try {
      const response = await axios.get(KEEP_ALIVE_URL);
      console.log(`🔁 Keep-alive ping successful: ${response.status}`);
    } catch (error) {
      console.error('❌ Keep-alive ping failed:', error.message);
    }
  });
};

module.exports = { startKeepAlivePing };
