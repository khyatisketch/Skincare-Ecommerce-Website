
const orderValidator = require('../validator/orderValidator');
const orderProvider = require('../provider/orderProvider');

const createOrder = async (req, res) => {
    try {
      const { decoded: { userId } } = req;
      console.log('Payload:', JSON.stringify(req.body, null, 2));
      
      const validatedData = await orderValidator.createOrderValidator({ ...req.body, userId: String(userId) });
      validatedData.userId = userId;
  
      const result = await orderProvider.createOrderProvider(validatedData);
      return _handleResponse(req, res, null, result, "Order created successfully");
    } catch (err) {
      console.error("Error in createOrder Controller ::", err);
      return _handleResponse(req, res, err);
    }
  };

const getMyOrders = async (req, res) => {
    try {
        console.log("Get My Orders Controller logic :::");
        const { decoded: { userId } } = req;

        const validatedData = await orderValidator.getMyOrdersValidator(userId);
        
        const result = await orderProvider.getMyOrdersProvider(validatedData);

        return _handleResponse(req, res, null, result, "Orders fetched successfully");
    } catch (err) {
        console.error("Error in Get My Orders Controller ::", err);
        return _handleResponse(req, res, err);
    }
};

const getAllOrders = async (req, res) => {
  try {
      console.log("Get All Orders Controller :::");

      const validatedQuery = await orderValidator.getAllOrdersValidator(req.query); // In case you use pagination/filtering
      const result = await orderProvider.getAllOrdersProvider(validatedQuery);

      return _handleResponse(req, res, null, result, 'Orders fetched successfully');
  } catch (err) {
      console.error("Error in Get All Orders Controller :: ", err);
      return _handleResponse(req, res, err);
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    if (!req.body || !req.body.status) {
      return _handleResponse(req, res, 'Request body missing or status not provided');
    }

    const validatedData = await orderValidator.updateStatusValidator(req.body);
    const result = await orderProvider.updateOrderStatusProvider(req.params.id, validatedData);

    return _handleResponse(req, res, null, result, 'Order status updated successfully');
  } catch (err) {
    console.error("Error in updateOrderStatus Controller :: ", err);
    return _handleResponse(req, res, err);
  }
};

const updateShippingInfo = async (req, res) => {
  try {
    if (!req.body) {
      return _handleResponse(req, res, 'Request body is empty');
    }

    const validatedData = await orderValidator.updateShippingInfoValidator(req.body);
    const { id } = req.params;
    const result = await orderProvider.updateShippingInfoProvider(id, validatedData);

    return _handleResponse(req, res, null, result, 'Shipping info updated successfully');
  } catch (err) {
    console.error("Error in updateShippingInfo Controller :: ", err);
    return _handleResponse(req, res, err);
  }
};

const resendOrderConfirmation = async (req, res) => {
  try {
      console.log("Order Controller :: Resend Confirmation Email");

      const validatedData = await orderValidator.resendOrderValidator(req);

      const result = await orderProvider.resendOrderConfirmationProvider(validatedData);

      return _handleResponse(req, res, null, result, result.message);
  } catch (err) {
      console.error("Error in Order Controller ::", err);
      return _handleResponse(req, res, err);
  }
};


module.exports = {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    updateShippingInfo,
    resendOrderConfirmation
  }