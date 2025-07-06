const Validator = require('validatorjs');

const addToWishlistValidator = async (dataObj) => {
    const rules = {
        productId: 'required|integer'
    };

    const v = new Validator(dataObj, rules);
    const matched = await v.check();

    if (!matched) {
        throw v.errors;
    }

    return {
        productId: dataObj.productId
    };
};

const removeValidator = async (params, user) => {
    const { productId } = params;

    const dataObj = {
        productId,
        userId: user?.userId
    };

    const rules = {
        productId: 'required|integer',
        userId: 'required|integer'
    };

    const v = new Validator(dataObj, rules);
    const matched = await v.check();

    if (!matched) {
        throw v.errors;
    }

    return {
        productId: parseInt(productId),
        userId: user.userId
    };
};

const getWishlistValidatorObj = async (user) => {
    const rules = {
        id: 'required|integer',
    };

    const dataObj = { id: user.userId };

    const v = new Validator(dataObj, rules);
    const matched = await v.check();

    if (!matched) {
        throw v.errors;
    }

    return { userId: user.userId };
};

module.exports = { 
    addToWishlistValidator,
    removeValidator,
    getWishlistValidatorObj
 };
