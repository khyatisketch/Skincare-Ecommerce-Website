const wishlistValidator = require('../validator/wishlistvalidator');
const wishlistProvider = require('../provider/wishlistProvider');

const addToWishlist = async (req, res) => {
    try {
        if (!req.body) {
            return _handleResponse(req, res, { message: "Request body is empty." });
        }

        const validatedData = await wishlistValidator.addToWishlistValidator(req.body);
        const result = await wishlistProvider.addToWishlistProvider(validatedData, req.user);

        return _handleResponse(req, res, null, result, result.message);
    } catch (err) {
        console.error("Error in Add to Wishlist Controller ::", err);
        return _handleResponse(req, res, err);
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        if (!req.params) {
            return _handleResponse(req, res, { error: 'Missing parameters' });
        }

        const validatedData = await wishlistValidator.removeValidator(req.params, req.user);
        const result = await wishlistProvider.removeProvider(validatedData);

        return _handleResponse(req, res, null, result, result.message);
    } catch (err) {
        console.error('Error in removeFromWishlist Controller ::', err);
        return _handleResponse(req, res, err);
    }
};

const getWishlist = async (req, res) => {
    try {
        const validatedData = await wishlistValidator.getWishlistValidatorObj(req.user);
        const result = await wishlistProvider.getWishlistProvider(validatedData);

        return _handleResponse(req, res, null, result, 'Wishlist fetched successfully');
    } catch (err) {
        console.error("Error in getWishlist Controller :: ", err);
        return _handleResponse(req, res, err);
    }
};

module.exports = {
    addToWishlist,
    removeFromWishlist,
    getWishlist
}