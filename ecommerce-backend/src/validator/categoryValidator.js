const { Validator } = require('node-input-validator')

const createCategoryValidator = async (dataObj) => {
    const { name } = dataObj;

    const rules = {
        name: 'required|string|lengthBetween:2,100'
    };

    const v = new Validator(dataObj, rules);
    const matched = await v.check();

    if (!matched) {
        throw v.errors;
    }

    return { name };
};

const updateCategoryValidator = async (dataObj) => {
    const { name, id } = dataObj;

    const rules = {
        name: 'required|string',
        id: 'required|integer'
    };

    const v = new Validator(dataObj, rules);
    const matched = await v.check();

    if (!matched) {
        throw v.errors;
    }

    return {
        name,
        id: parseInt(id)
    };
};

const deleteCategoryValidator = async (params) => {
    const rules = {
        id: 'required|integer',
    };

    const v = new Validator(params, rules);
    const matched = await v.check();

    if (!matched) {
        throw v.errors;
    }

    return { id: parseInt(params.id) };
};

module.exports = {
    createCategoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator
};