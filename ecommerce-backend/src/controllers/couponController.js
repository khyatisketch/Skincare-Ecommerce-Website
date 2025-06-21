const couponValidator = require('../validator/couponValidator');
const couponProvider = require('../provider/couponProvider');

const createCoupon = async (req, res) => {
    try {
      if (!req.body) {
        return _handleResponse(req, res, { error: 'Request body is empty' });
      }
  
      const validatedData = await couponValidator.createCouponValidator(req.body);
      const result = await couponProvider.createCouponProvider(validatedData);
  
      return _handleResponse(req, res, null, result, 'Coupon created successfully');
    } catch (err) {
      console.error('Error in Coupon Controller ::', err);
      return _handleResponse(req, res, err);
    }
  };

  const applyCoupon = async (req, res) => {
    try {
        console.log("Apply Coupon Controller logic :::");

        if (!req.body) {
            return _handleResponse(req, res, { error: 'Request body is empty' });
        }

        const validatedData = await couponValidator.applyCouponValidator(req.body);
        const result = await couponProvider.applyCouponProvider(validatedData);

        return _handleResponse(req, res, null, result, result.message || 'Coupon applied successfully');

    } catch (err) {
        console.error("Error in Apply Coupon Controller :: ", err);
        return _handleResponse(req, res, err);
    }
};

module.exports = {
    createCoupon,
    applyCoupon
}