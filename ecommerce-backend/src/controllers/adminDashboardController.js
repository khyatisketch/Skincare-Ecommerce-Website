const adminDashboardValidator = require('../validator/adminDashboardValidator');
const adminDashboardProvider = require('../provider/adminDashboardProvider');

const getDashboardData = async (req, res) => {
    try {
        // If you expect any query params or body input, validate here
        const validatedData = await adminDashboardValidator.validateDashboardQuery(req.query);

        const result = await adminDashboardProvider.getDashboardData(validatedData);

        return _handleResponse(req, res, null, result, 'Dashboard data fetched successfully');
    } catch (err) {
        console.error("Error in Dashboard Controller ::", err);
        return _handleResponse(req, res, err);
    }
};

module.exports = {
    getDashboardData,
};