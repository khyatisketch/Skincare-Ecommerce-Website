const prisma = require('../prisma');

const createProductProvider = async ({ name, description, price, stock, imageUrl, categoryId }) => {
    try {
        const product = await prisma.product.create({
            data: {
                name,
                description,
                price,
                stock,
                imageUrl,
                categoryId,
            },
        });

        return product;
    } catch (error) {
        console.error("Error in Product Provider ::", error);
        throw error;
    }
};

const getAllProductsProvider = async ({
    categoryId,
    minPrice,
    maxPrice,
    search,
    page,
    limit,
    lowStock,
  }) => {
    const filters = {};
  
    if (categoryId) {
      filters.categoryId = categoryId;
    }
  
    if (minPrice !== undefined || maxPrice !== undefined) {
      filters.price = {};
      if (minPrice !== undefined) filters.price.gte = minPrice;
      if (maxPrice !== undefined) filters.price.lte = maxPrice;
    }
  
    if (search) {
      filters.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (lowStock) {
        filters.stock = {
          lt: 5, // less than 5 items
        };
      }
  
    const skip = (page - 1) * limit;
  
    const totalProducts = await prisma.product.count({ where: filters });
  
    const products = await prisma.product.findMany({
        where: {
          ...(categoryId && { categoryId }),
          ...(search && {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          }),
          ...(minPrice !== undefined || maxPrice !== undefined
            ? {
                price: {
                  ...(minPrice !== undefined && { gte: minPrice }),
                  ...(maxPrice !== undefined && { lte: maxPrice }),
                },
              }
            : {}),
          ...(lowStock && {
            stock: {
              lt: 5,
            },
          }),
        },
        include: { category: true },
        skip,
        take: limit,
        orderBy: lowStock ? { stock: 'asc' } : { createdAt: 'desc' },
      });
      
  
    return {
      data: products,
      total: totalProducts,
      page,
      totalPages: Math.ceil(totalProducts / limit),
    };
  };    

const getProductByIdProvider = async ({ id }) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: { category: true },
        });

        if (!product) {
            throw { error: 'Product not found', status: 404 };
        }

        return product;
    } catch (error) {
        console.error("Error in Product Provider ::", error);
        throw error;
    }
};

const getRelatedProductsProvider = async ({ categoryId, exclude }) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                categoryId,
                ...(exclude && { id: { not: exclude } }),
            },
            take: 4,
        });

        return {
            message: 'Related products fetched successfully',
            data: products,
        };
    } catch (error) {
        console.error("Error in getRelatedProducts Provider ::", error);
        throw error;
    }
};

const updateProductProvider = async ({ id, name, description, price, imageUrl, stock, categoryId }) => {
    try {
        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                price,
                imageUrl,
                stock,
                categoryId,
            },
        });

        return updatedProduct;
    } catch (error) {
        console.error("Error in Update Product Provider ::", error);
        throw error;
    }
};

const deleteProductProvider = async ({ id }) => {
    try {
        await prisma.product.delete({
            where: { id }
        });

        return {
            message: 'Product deleted successfully',
        };
    } catch (error) {
        console.error("Error in Delete Product Provider ::", error);
        throw error;
    }
};

const restockProductProvider = async ({ id, amount }) => {
  try {
    const updated = await prisma.product.update({
      where: { id },
      data: {
        stock: {
          increment: amount,
        },
      },
    });

    return updated;
  } catch (error) {
    console.error("Error in Restock Provider ::", error);
    throw error;
  }
};

const createReviewProvider = async ({ rating, comment, productId, userId }) => {
  try {
      const review = await prisma.review.create({
          data: {
              rating,
              comment,
              productId,
              userId,
          },
      });

      return {
          review,
      };
  } catch (error) {
      console.error("Error in createReview Provider ::", error);
      throw error;
  }
};

const getProductReviewsProvider = async ({ productId }) => {
  try {
      const reviews = await prisma.review.findMany({
          where: { productId, status: 'approved' },
          include: { user: true },
          orderBy: { createdAt: 'desc' },
      });

      return { reviews };
  } catch (error) {
      console.error("Error in getProductReviews provider ::", error);
      throw error;
  }
};

const getAvgRatingProvider = async ({ productId }) => {
  try {
    const avgRating = await prisma.review.aggregate({
      where: { productId: parseInt(productId) },
      _avg: { rating: true },
    });

    const reviewCount = await prisma.review.count({
      where: { productId: parseInt(productId) },
    });

    return {
      averageRating: avgRating._avg.rating || 0,
      reviewCount: reviewCount || 0,
    };
  } catch (error) {
    console.error("Error in Avg Rating Provider ::", error);
    throw error;
  }
};

const getReviewsProvider = async ({ status, page, limit }) => {
  try {
      const [totalCount, reviews] = await Promise.all([
          prisma.review.count({ where: { status } }),
          prisma.review.findMany({
              where: { status },
              skip: (page - 1) * limit,
              take: limit,
              orderBy: { createdAt: 'desc' },
              include: {
                  product: { select: { name: true, imageUrl: true } },
                  user: { select: { phone: true } },
              },
          }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
          reviews,
          page,
          limit,
          totalCount,
          totalPages,
      };
  } catch (error) {
      console.error('Error in getReviewsProvider ::', error);
      throw error;
  }
};

const approveReviewProvider = async ({ id }) => {
  try {
      const updatedReview = await prisma.review.update({
          where: { id },
          data: { status: 'approved' },
      });

      return {
          message: 'Review approved successfully.',
          review: updatedReview,
      };
  } catch (error) {
      console.error("Error in approveReview Provider ::", error);
      throw error;
  }
};

const deleteReviewProvider = async ({ id }) => {
  try {
      await prisma.review.delete({ where: { id } });

      return {
          message: 'Review deleted successfully',
      };
  } catch (error) {
      console.error("Error in Delete Review Provider ::", error);
      throw error;
  }
};

module.exports = {
    createProductProvider,
    getAllProductsProvider,
    updateProductProvider,
    deleteProductProvider,
    getProductByIdProvider,
    getRelatedProductsProvider,
    restockProductProvider,
    createReviewProvider,
    getProductReviewsProvider,
    getAvgRatingProvider,
    getReviewsProvider,
    approveReviewProvider,
    deleteReviewProvider
};