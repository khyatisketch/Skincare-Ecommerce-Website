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

  const updateCoupon = async (req, res) => {
    try {
      let { id } = req.params;
  
      if (!req.body || !id) {
        return _handleResponse(req, res, { error: 'Coupon ID and data are required' });
      }
  
      // 🔧 Convert id to number if Prisma expects Int
      id = parseInt(id);
      if (isNaN(id)) {
        return _handleResponse(req, res, { error: 'Invalid coupon ID format' });
      }
  
      const validatedData = await couponValidator.updateCouponValidator(req.body);
      const result = await couponProvider.updateCouponProvider(id, validatedData);
  
      return _handleResponse(req, res, null, result, 'Coupon updated successfully');
    } catch (err) {
      console.error('Error in Update Coupon Controller ::', err);
      return _handleResponse(req, res, err);
    }
  };
  

const getAllCoupons = async (req, res) => {
    try {
        const validatedQuery = await couponValidator.getAllCouponsValidator(req.query);
        const result = await couponProvider.getAllCouponsProvider(validatedQuery);

        return _handleResponse(req, res, null, result, "Fetched coupons successfully");
    } catch (err) {
        console.error("Error in getAllCoupons Controller ::", err);
        return _handleResponse(req, res, err);
    }
};

const deleteCoupon = async (req, res) => {
  try {
      console.log("Coupon Delete Controller :::");

      const validatedData = await couponValidator.deleteCouponValidator(req.params);
      const result = await couponProvider.deleteCouponProvider(validatedData);

      return _handleResponse(req, res, null, result, result.message);
  } catch (err) {
      console.error("Error in Delete Coupon Controller :: ", err);
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
    updateCoupon,
    applyCoupon,
    getAllCoupons,
    deleteCoupon
}