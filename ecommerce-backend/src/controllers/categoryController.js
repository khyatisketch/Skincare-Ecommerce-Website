const categoryValidator = require('../validator/categoryValidator');
const categoryProvider = require('../provider/categoryProvider');

const createCategory = async (req, res) => {
    try {
        if (!req.body) {
            return _handleResponse(req, res, { message: 'Request body is empty' });
        }

        const validatedData = await categoryValidator.createCategoryValidator(req.body);
        const result = await categoryProvider.createCategoryProvider(validatedData);

        return _handleResponse(req, res, null, result, 'Category created successfully');
    } catch (err) {
        console.error("Error in Category Controller ::", err);
        return _handleResponse(req, res, err);
    }
};

const getAllCategories = async (req, res) => {
    try {
        console.log("Category Controller ::: Fetching all categories");

        const result = await categoryProvider.getAllCategoriesProvider();

        return _handleResponse(req, res, null, result, "Fetched all categories successfully");
    } catch (err) {
        console.error("Error in Category Controller ::", err);
        return _handleResponse(req, res, err);
    }
};

const updateCategory = async (req, res) => {
    try {
        if (!req.body) {
            return _handleResponse(req, res, { message: 'Request body is empty' });
        }

        const validatedData = await categoryValidator.updateCategoryValidator({
            ...req.body,
            id: req.params.id
        });

        const result = await categoryProvider.updateCategoryProvider(validatedData);

        return _handleResponse(req, res, null, result, 'Category updated successfully');
    } catch (err) {
        console.error("Error in updateCategory Controller :: ", err);
        return _handleResponse(req, res, err);
    }
};

const deleteCategory = async (req, res) => {
    try {
        if (!req.params || !req.params.id) {
            return _handleResponse(req, res, { message: 'Category ID is required' });
        }

        const validatedData = await categoryValidator.deleteCategoryValidator(req.params);
        const result = await categoryProvider.deleteCategoryProvider(validatedData);

        return _handleResponse(req, res, null, result, 'Category deleted successfully');
    } catch (err) {
        console.error("Error in deleteCategory Controller :: ", err);
        return _handleResponse(req, res, err);
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
}