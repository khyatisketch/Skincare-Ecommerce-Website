const Validator = require('validatorjs');

const validateDashboardQuery = async (query) => {
    // Currently no inputs, but this is future-proof
    const rules = {
        // Example: timeRange: 'string|in:today,week,month'
    };

    const v = new Validator(query, rules);
    const matched = await v.check();

    if (!matched) {
        throw v.errors;
    }

    return query; // Nothing to return now, but useful if filters are added
};

module.exports = {
    validateDashboardQuery,
};
