const prisma = require('../prisma');

const addToWishlistProvider = async ({ productId }, user) => {
    try {
        const wishlistItem = await prisma.wishlist.upsert({
            where: {
                userId_productId: {
                    userId: user.userId,
                    productId
                }
            },
            update: {},
            create: {
                userId: user.userId,
                productId
            }
        });

        return {
            message: "Product added to wishlist successfully",
            data: wishlistItem
        };
    } catch (error) {
        console.error("Error in Wishlist Provider ::", error);
        throw error;
    }
};

const removeProvider = async ({ userId, productId }) => {
    try {
        await prisma.wishlist.delete({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            }
        });

        return {
            message: 'Product removed from wishlist successfully',
        };
    } catch (error) {
        console.error('Error in removeFromWishlist Provider ::', error);
        throw { error: 'Failed to remove from wishlist' };
    }
};

const getWishlistProvider = async ({ userId }) => {
    try {
        const items = await prisma.wishlist.findMany({
            where: { userId },
            include: { product: true },
        });

        return {
            wishlist: items,
        };
    } catch (error) {
        console.error("Error in getWishlist Provider ::", error);
        throw error;
    }
};

module.exports = { 
    addToWishlistProvider,
    removeProvider,
    getWishlistProvider
};