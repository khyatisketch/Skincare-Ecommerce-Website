const { Validator } = require('node-input-validator')

const otpValidatorObj = async (dataObj) => {
    const { phone } = dataObj;

    const rules = {
        phone: 'required|string|lengthBetween:10,15'
    };
    console.log("Received phone in validator:", phone);


    const v = new Validator(dataObj, rules);
    const matched = await v.check();

    if (!matched) {
        throw v.errors;
    }

    return { phone };
};

const verifyOtpValidatorObj = async function (dataObj) {
    const { phone, code, sessionId } = dataObj;

    const rules = {
        phone: 'required|string|lengthBetween:10,15',
        code: 'required|string|lengthBetween:4,6'
    };

    const v = new Validator(dataObj, rules);
    const matched = await v.check();

    if (!matched) {
        throw v.errors;
    }

    return { phone, code };
};


const updateProfileValidator = async (data) => {
    const rules = {
      name: 'required|string|lengthBetween:1,50',
      email: 'required|email',
      profileImageUrl: 'string' // removed `url` validation
    };
  
    const v = new Validator(data, rules);
    const matched = await v.check();
  
    if (!matched) {
      throw v.errors;
    }
  
    return {
      name: data.name,
      email: data.email,
      profileImageUrl: data.profileImageUrl || null,
    };
  };
  
  const subscribeValidator = async (dataObj) => {
    const { email } = dataObj;

    const rules = {
        email: 'required|email',
    };

    const v = new Validator(dataObj, rules);
    const matched = await v.check();

    if (!matched) {
        throw v.errors;
    }

    return { email };
};

module.exports = {
    otpValidatorObj,
    verifyOtpValidatorObj,
    updateProfileValidator,
    subscribeValidator
}