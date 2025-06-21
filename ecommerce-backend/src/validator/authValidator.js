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
    const { phone, code } = dataObj;

    const rules = {
        phone: 'required|string|lengthBetween:10,15',
        code: 'required|string|lengthBetween:4,6',
    };

    const v = new Validator(dataObj, rules);
    const matched = await v.check();

    if (!matched) {
        throw v.errors;
    }

    return { phone, code };
};

module.exports = {
    otpValidatorObj,
    verifyOtpValidatorObj
}