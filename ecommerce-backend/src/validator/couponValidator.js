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


module.exports = {
  createCouponValidator,
  applyCouponValidator
};
