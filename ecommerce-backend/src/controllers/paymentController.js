const paymentValidator = require('../validator/paymentValidator');
const paymentProvider = require('../provider/paymentProvider');

const createCheckoutSession = async (req, res) => {
    try {
      if (!req.body) {
        return _handleResponse(req, res, { message: 'Request body is empty' });
      }
  
      // Validate cart items + shipping info
      const validatedData = await paymentValidator.validateCartItems(req.body);
  
      // Pass validated cartItems + shipping to provider
      const sessionResult = await paymentProvider.createCheckoutSessionProvider(validatedData);
  
      return _handleResponse(req, res, null, sessionResult, 'Checkout session created successfully');
    } catch (err) {
      console.error("Error in createCheckoutSession Controller :: ", err);
      return _handleResponse(req, res, err);
    }
  };
  

module.exports = {
    createCheckoutSession,
};