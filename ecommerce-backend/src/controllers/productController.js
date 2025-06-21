const productValidator = require('../validator/productValidator');
const productProvider = require('../provider/productProvider');
const messages = require('../config/messages')

const createProduct = async (req, res) => {
    try {
      if (!req.body) {
        return _handleResponse(req, res, { message: 'Request body is empty' });
      }
  
      // Extract all image URLs from uploaded files
      const imageUrls = req.files?.map(file => file.path) || [];
  
      const data = {
        ...req.body,
        imageUrl: imageUrls, // pass an array of URLs
      };
  
      const validatedData = await productValidator.createProductValidator(data);
      const result = await productProvider.createProductProvider(validatedData);
  
      return _handleResponse(req, res, null, result, 'Product created successfully');
    } catch (err) {
      console.error("Error in Product Controller :: ", err);
      return _handleResponse(req, res, err);
    }
  };

const getAllProducts = async (req, res) => {
    try {
      const validatedQuery = await productValidator.getAllProductsValidator(req.query);
      const products = await productProvider.getAllProductsProvider(validatedQuery);
  
      return _handleResponse(req, res, null, products);
    } catch (err) {
      console.error("Error in Product Controller :: ", err);
      return _handleResponse(req, res, err);
    }
  };

const getProductById = async (req, res) => {
    try {
        console.log("Product Controller :: getProductById");

        if (!req.params) {
            return _handleResponse(req, res, { error: 'Request params missing' });
        }

        const validatedData = await productValidator.productIdValidatorObj(req.params);
        const result = await productProvider.getProductByIdProvider(validatedData);

        return _handleResponse(req, res, null, result, 'Product fetched successfully');
    } catch (err) {
        console.error("Error in Product Controller :: ", err);
        return _handleResponse(req, res, err);
    }
};

const getRelatedProducts = async (req, res) => {
  try {
      const validatedParams = await productValidator.relatedProductsValidator({
          ...req.params,
          ...req.query
      });

      const result = await productProvider.getRelatedProductsProvider(validatedParams);

      return _handleResponse(req, res, null, result, result.message);
  } catch (err) {
      console.error("Error in getRelatedProducts Controller :: ", err);
      return _handleResponse(req, res, err);
  }
};

const updateProduct = async (req, res) => {
    try {
        console.log("Update Product Controller :::");

        if (!req.body && !req.files) {
            return _handleResponse(req, res, { error: 'Request body is empty' });
        }

        // Merge body and uploaded images
        const existingImages = Array.isArray(req.body.imageUrl)
        ? req.body.imageUrl
        : req.body.imageUrl ? [req.body.imageUrl] : [];
      
      const newUploads = req.files?.map(file => file.path) || [];
      
      const data = {
        ...req.body,
        imageUrl: [...existingImages, ...newUploads],
      };
        const validatedData = await productValidator.updateProductValidatorObj(data, req.params.id);
        const result = await productProvider.updateProductProvider(validatedData);

        return _handleResponse(req, res, null, result, "Product updated successfully");
    } catch (err) {
        console.error("Error in Update Product Controller :: ", err);
        return _handleResponse(req, res, err);
    }
};

const deleteProduct = async (req, res) => {
    try {
        console.log("Delete Product Controller :::");

        if (!req.params) {
            return _handleResponse(req, res, { message: 'Request params missing' });
        }

        const validatedData = await productValidator.deleteProductValidator(req.params);
        const result = await productProvider.deleteProductProvider(validatedData);

        return _handleResponse(req, res, null, result, result.message, 204); // 204 No Content
    } catch (err) {
        console.error("Error in Delete Product Controller :: ", err);
        return _handleResponse(req, res, err);
    }
};

const restockProduct = async (req, res) => {
  try {
    console.log("Restock Controller :::");

    if (!req.body) {
      return _handleResponse(req, res, { error: 'Request body is empty' });
    }

    const validatedData = await productValidator.restockValidator({
      ...req.body,
      id: req.params.id,
    });

    const result = await productProvider.restockProductProvider(validatedData);

    return _handleResponse(req, res, null, result, 'Product restocked successfully');
  } catch (err) {
    console.error("Error in Restock Controller ::", err);
    return _handleResponse(req, res, err);
  }
};

const createReview = async (req, res) => {
  try {
      const { id: productId } = req.params;
      const userId = req.user.userId;

      if (!req.body || !productId || !userId) {
          return _handleResponse(req, res, { message: 'Missing data in request' });
      }

      const validatedData = await productValidator.validateReview({ ...req.body, productId, userId });
      const result = await productProvider.createReviewProvider(validatedData);

      return _handleResponse(req, res, null, result, 'Review submitted successfully');
  } catch (err) {
      console.error("Error in createReview Controller ::", err);
      return _handleResponse(req, res, err);
  }
};

const getProductReviews = async (req, res) => {
  try {
      console.log("Review Controller: Fetching product reviews");

      const validatedParams = await productValidator.getProductReviewsValidator(req.params);
      const result = await productProvider.getProductReviewsProvider(validatedParams);

      return _handleResponse(req, res, null, result, 'Product reviews fetched successfully');
  } catch (err) {
      console.error("Error in getProductReviews controller ::", err);
      return _handleResponse(req, res, err);
  }
};

const getAvgRating = async (req, res) => {
  try {
    if (!req.body || !req.body.productId) {
      return _handleResponse(req, res, messages.error.REQ_BODY_EMPTY);
    }

    const validatedData = await productValidator.avgRatingValidatorObj(req.body);
    const result = await productProvider.getAvgRatingProvider(validatedData);

    return _handleResponse(req, res, null, result, 'Average ratings fetched successfully');
  } catch (err) {
    console.error("Error in Avg Rating Controller :: ", err);
    return _handleResponse(req, res, err);
  }
};

const getReviews = async (req, res) => {
  try {
      const validatedQuery = await productValidator.reviewListValidator(req.query);
      const result = await productProvider.getReviewsProvider(validatedQuery);

      return _handleResponse(req, res, null, result, 'Reviews fetched successfully');
  } catch (error) {
      console.error('Error in getReviews controller ::', error);
      return _handleResponse(req, res, error);
  }
};

const approveReview = async (req, res) => {
  try {
      const validatedData = await productValidator.approveReviewValidator({ id: req.params.id });
      const result = await productProvider.approveReviewProvider(validatedData);

      return _handleResponse(req, res, null, result, result.message);
  } catch (err) {
      console.error("Error in approveReview Controller ::", err);
      return _handleResponse(req, res, err);
  }
};

const deleteReview = async (req, res) => {
  try {
      console.log("Delete Review Controller :::");

      const validatedData = await productValidator.deleteReviewValidator(req.params);
      const result = await productProvider.deleteReviewProvider(validatedData);

      return _handleResponse(req, res, null, result, result.message);
  } catch (err) {
      console.error("Error in Delete Review Controller ::", err);
      return _handleResponse(req, res, err);
  }
};

module.exports = {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    getProductById,
    getRelatedProducts,
    restockProduct,
    createReview,
    getProductReviews,
    getAvgRating,
    getReviews,
    approveReview,
    deleteReview
};