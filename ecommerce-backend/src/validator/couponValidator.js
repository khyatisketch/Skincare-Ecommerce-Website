const Validator = require('validatorjs');

const createCouponValidator = async (dataObj) => {
  const rules = {
    code: 'required|string',
    type: 'required|in:percentage,amount',
    value: 'required|numeric|min:1',
    minOrderValue: 'numeric|min:0',
    usageLimit: 'numeric|min:1',
    expiresAt: 'required|date',
  };

  const v = new Validator(dataObj, rules);
  const matched = await v.check();

  if (!matched) {
    throw v.errors;
  }

  return {
    code: dataObj.code.toUpperCase(),
    type: dataObj.type,
    value: Number(dataObj.value),
    minOrderValue: dataObj.minOrderValue ? Number(dataObj.minOrderValue) : 0,
    usageLimit: dataObj.usageLimit ? Number(dataObj.usageLimit) : null,
    expiresAt: new Date(dataObj.expiresAt),
  };
};

const updateCouponValidator = async (dataObj) => {
  const rules = {
    code: 'string',
    type: 'in:percentage,amount',
    value: 'numeric|min:1',
    minOrderValue: 'numeric|min:0',
    usageLimit: 'numeric|min:1',
    expiresAt: 'date',
  };

  const v = new Validator(dataObj, rules);
  const matched = await v.check();

  if (!matched) {
    throw v.errors;
  }

  const validated = {};

  if (dataObj.code) validated.code = dataObj.code.toUpperCase();
  if (dataObj.type) validated.type = dataObj.type;
  if (dataObj.value) validated.value = Number(dataObj.value);
  if (dataObj.minOrderValue !== undefined) validated.minOrderValue = Number(dataObj.minOrderValue);
  if (dataObj.usageLimit !== undefined) validated.usageLimit = Number(dataObj.usageLimit);
  if (dataObj.expiresAt) validated.expiresAt = new Date(dataObj.expiresAt);

  return validated;
};

const applyCouponValidator = async (dataObj) => {
  const { code, orderTotal } = dataObj;

  const rules = {
      code: 'required|string',
      orderTotal: 'required|numeric|min:0'
  };

  const v = new Validator(dataObj, rules);
  const matched = await v.check();

  if (!matched) {
      throw v.errors;
  }

  return {
      code: code.toUpperCase(),
      orderTotal
  };
};

const getAllCouponsValidator = async (queryObj) => {
  // For now, no query parameters are validated — basic scaffold
  const rules = {}; // Add pagination/sorting filters here if needed later

  const v = new Validator(queryObj, rules);
  const matched = await v.check();

  if (!matched) {
      throw v.errors;
  }

  return queryObj;
};

const deleteCouponValidator = async (dataObj) => {
  const { id } = dataObj;

  const rules = {
      id: 'required|integer'
  };

  const v = new Validator(dataObj, rules);
  const matched = await v.check();

  if (!matched) {
      throw v.errors;
  }

  return { id: parseInt(id) };
};


module.exports = {
  createCouponValidator,
  updateCouponValidator,
  applyCouponValidator,
  getAllCouponsValidator,
  deleteCouponValidator
};
