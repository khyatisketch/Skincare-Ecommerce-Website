const { Validator } = require('node-input-validator')

const createProductValidator = async (data) => {
    const rules = {
      name: 'required|string',
      description: 'string',
      price: 'required|numeric',
      imageUrl: 'array',  // change from string to array
      stock: 'required|integer',
      categoryId: 'required|integer',
    };
  
    const v = new Validator(data, rules);
    const matched = await v.check();
  
    if (!matched) {
      throw v.errors;
    }
  
    return {
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      imageUrl: data.imageUrl, // keep as array
      stock: parseInt(data.stock, 10),
      categoryId: parseInt(data.categoryId, 10),
    };
  };

const getAllProductsValidator = async (query) => {
    const rules = {
      categoryId: 'integer',
      minPrice: 'numeric',
      maxPrice: 'numeric',
      search: 'string',
      page: 'integer|lengthBetween:1,5',
      limit: 'integer|lengthBetween:1,100',
      lowStock: 'string',
    };
  
    const v = new Validator(query, rules);
  
    const matched = await v.check();
  
    if (!matched) {
      throw v.errors;
    }
  
    // Parse & sanitize
    return {
      categoryId: query.categoryId ? parseInt(query.categoryId) : undefined,
      minPrice: query.minPrice ? parseFloat(query.minPrice) : undefined,
      maxPrice: query.maxPrice ? parseFloat(query.maxPrice) : undefined,
      search: query.search || undefined,
      page: query.page ? parseInt(query.page) : 1,
      limit: query.limit ? parseInt(query.limit) : 10,
      lowStock: query.lowStock === 'true',
    };
  };

const productIdValidatorObj = async (dataObj) => {
    const { id } = dataObj;

    const rules = {
        id: 'required|integer|lengthBetween:1,5',
    };

    const v = new Validator(dataObj, rules);
    const matched = await v.check();

    if (!matched) {
        throw v.errors;
    }

    return { id: parseInt(id) };
};

const relatedProductsValidator = async (dataObj) => {
  const { categoryId, exclude } = dataObj;

  const rules = {
    categoryId: 'required|numeric',
    exclude: 'numeric', // optional but must be a string if passed
  };

  const v = new Validator(dataObj, rules);
  const matched = await v.check();

  if (!matched) {
      throw v.errors;
  }

  return { categoryId: parseInt(categoryId, 10), // ✅ convert to number
    exclude: exclude ? parseInt(exclude, 10) : undefined, };
};

const updateProductValidatorObj = async (dataObj, id) => {
    const { name, description, price, imageUrl, stock, categoryId } = dataObj;

    const rules = {
        name: 'required|string',
        description: 'string',
        price: 'numeric',
        imageUrl: 'array',  // changed from 'string' to 'array'
        stock: 'integer',   // fixed from 'quantity' to 'stock'
        categoryId: 'required|integer',
    };

    const v = new Validator(dataObj, rules);
    const matched = await v.check();

    if (!matched) {
        throw v.errors;
    }

    return {
        id: parseInt(id),
        name,
        description,
        price: parseFloat(price),
        imageUrl, // array of URLs
        stock: parseInt(stock, 10),
        categoryId: parseInt(categoryId, 10),
    };
};

const deleteProductValidator = async (dataObj) => {
    const { id } = dataObj;

    const rules = {
        id: 'required|integer|min:1'
    };

    const v = new Validator(dataObj, rules);
    const matched = await v.check();

    if (!matched) {
        throw v.errors;
    }

    return { id: parseInt(id) };
};

const restockValidator = async (dataObj) => {
  const { id, amount } = dataObj;

  const rules = {
    id: 'required|integer',
    amount: 'required|integer|min:1',
  };

  const v = new Validator(dataObj, rules);
  const matched = await v.check();

  if (!matched) {
    throw v.errors;
  }

  return {
    id: parseInt(id, 10),
    amount: parseInt(amount, 10),
  };
};

const validateReview = async (dataObj) => {
  const { rating, comment, productId, userId } = dataObj;

  const rules = {
      rating: 'required|integer|min:1|max:5',
      comment: 'string',
      productId: 'required|integer',
      userId: 'required|integer',
  };

  const v = new Validator(dataObj, rules);
  const matched = await v.check();

  if (!matched) {
      throw v.errors;
  }

  return {
      rating,
      comment,
      productId: parseInt(productId),
      userId,
  };
};

const getProductReviewsValidator = async (params) => {
  const rules = {
      id: 'required|integer',
  };

  const v = new Validator(params, rules);
  const matched = await v.check();

  if (!matched) {
      throw v.errors;
  }

  return {
      productId: parseInt(params.id),
  };
};

const avgRatingValidatorObj = async (dataObj) => {
  const { productId } = dataObj;

  const rules = {
      productId: 'required|numeric'
  };

  const v = new Validator(dataObj, rules);
  const matched = await v.check();

  if (!matched) {
      throw v.errors;
  }

  return { productId };
};

const reviewListValidator = async (queryObj) => {
  const rules = {
      status: 'string|in:pending,approved,rejected',
      page: 'numeric|lengthBetween:1,10',
      limit: 'numeric|lengthBetween:1,100',
  };

  const validation = new Validator(queryObj, rules);
  const matched = await validation.check();

  if (!matched) {
      throw validation.errors;
  }

  return {
      status: queryObj.status || 'pending',
      page: parseInt(queryObj.page) || 1,
      limit: parseInt(queryObj.limit) || 10,
  };
};

const approveReviewValidator = async ({ id }) => {
  const rules = {
      id: 'required|integer|min:1',
  };

  const dataObj = { id };
  const v = new Validator(dataObj, rules);
  const matched = await v.check();

  if (!matched) {
      throw v.errors;
  }

  return { id: parseInt(id) };
};

const deleteReviewValidator = async (params) => {
  const rules = {
      id: 'required|integer',
  };

  const v = new Validator(params, rules);
  const matched = await v.check();

  if (!matched) {
      throw v.errors;
  }

  return {
      id: parseInt(params.id),
  };
};

module.exports = {
    createProductValidator,
    updateProductValidatorObj,
    deleteProductValidator,
    getAllProductsValidator,
    productIdValidatorObj,
    relatedProductsValidator,
    restockValidator,
    validateReview,
    getProductReviewsValidator,
    avgRatingValidatorObj,
    reviewListValidator,
    approveReviewValidator,
    deleteReviewValidator
};