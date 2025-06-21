const Validator = require('validatorjs');

const validateCartItems = async (dataObj) => {
    const { cartItems, shipping } = dataObj;
  
    const rules = {
      cartItems: 'required|array|min:1',
      'cartItems.*.id': 'required|integer|min:1',
      'cartItems.*.quantity': 'required|integer|min:1',
  
      shipping: 'required',
      'shipping.email': 'required|email',
      'shipping.name': 'required|string|min:2',
      'shipping.phone': 'required|string|min:7',
      'shipping.address': 'required|string|min:5',
    };
  
    const v = new Validator(dataObj, rules);
    const matched = await v.check();
  
    if (!matched) {
      throw v.errors;
    }
  
    return { cartItems, shipping };
  };
  

module.exports = {
    validateCartItems,
};