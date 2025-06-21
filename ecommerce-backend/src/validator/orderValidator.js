const { Validator } = require('node-input-validator');

const createOrderValidator = async (dataObj) => {
  const { items, userId, shippingAddress } = dataObj;

  const rules = {
    userId: 'required|string',
    items: 'required|array',
    'items.*.productId': 'required|string',
    'items.*.quantity': 'required|integer|min:1',
    shippingAddress: 'required|string'  // Add validation for shippingAddress
  };

  const validation = new Validator(dataObj, rules);
  const matched = await validation.check();

  if (!matched || !Array.isArray(items) || items.length < 1) {
    const errors = validation.errors;
    if (!Array.isArray(items) || items.length < 1) {
      errors.items = {
        message: "The items array must contain at least one item.",
        rule: "minItems"
      };
    }
    throw errors;
  }

  return { userId, items, shippingAddress };
};


const getMyOrdersValidator = async (userId) => {
  const data = { userId };
  const rules = {
      userId: 'required',
  };

  const v = new Validator(data, rules);
  const matched = await v.check();

  if (!matched) {
      throw v.errors;
  }

  return { userId };
};

const getAllOrdersValidator = async (queryParams) => {
  const rules = {
      // Example: support pagination if needed
      limit: 'integer|min:1',
      offset: 'integer|min:0',
  };

  const v = new Validator(queryParams, rules);
  const matched = await v.check();

  if (!matched) {
      throw v.errors;
  }

  return {
      limit: parseInt(queryParams.limit) || 10,
      offset: parseInt(queryParams.offset) || 0,
  };
};

const updateStatusValidator = async (dataObj) => {
  const { status } = dataObj;

  const rules = {
    status: 'required|string|in:PENDING,PAID,SHIPPED,CANCELLED'
  };

  const v = new Validator(dataObj, rules);
  const matched = await v.check();

  if (!matched) {
    throw v.errors;
  }

  return { status };
};

const updateShippingInfoValidator = async (dataObj) => {
  const { shippingAddress, trackingNumber } = dataObj;

  const rules = {
    shippingAddress: 'required|string|lengthBetween:5,1000',
    trackingNumber: 'string',
  };

  const v = new Validator(dataObj, rules);
  const matched = await v.check();

  if (!matched) {
    throw v.errors;
  }

  return { shippingAddress, trackingNumber };
};

const resendOrderValidator = async (req) => {
  const { orderId } = req.params;

  const rules = {
      orderId: 'required|integer'
  };

  const v = new Validator({ orderId }, rules);
  const matched = await v.check();

  if (!matched) {
      throw v.errors;
  }

  return {
      userId: req.user.userId,  // from JWT middleware
      orderId: parseInt(orderId),
  };
};

module.exports = {
  createOrderValidator,
  getMyOrdersValidator,
  getAllOrdersValidator,
  updateStatusValidator,
  updateShippingInfoValidator,
  resendOrderValidator
};
