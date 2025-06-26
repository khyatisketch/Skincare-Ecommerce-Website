const prisma = require('../prisma');

const createCouponProvider = async (couponData) => {
    try {
      const coupon = await prisma.coupon.create({
        data: couponData,
      });
  
      return coupon;
    } catch (error) {
      console.error('Error in Coupon Provider ::', error);
      throw error;
    }
  };

  const updateCouponProvider = async (id, updateData) => {
    try {
      const updatedCoupon = await prisma.coupon.update({
        where: { id },
        data: updateData,
      });
  
      return updatedCoupon;
    } catch (error) {
      console.error('Error in Update Coupon Provider ::', error);
      throw error;
    }
  };

  const getAllCouponsProvider = async () => {
    try {
        const coupons = await prisma.coupon.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        return {
            coupons,
        };
    } catch (error) {
        console.error("Error in getAllCoupons Provider ::", error);
        throw error;
    }
};
  

const applyCouponProvider = async ({ code, orderTotal }) => {
    try {
        const coupon = await prisma.coupon.findUnique({
            where: { code }
        });

        if (!coupon) {
            throw { error: 'Invalid coupon code' };
        }

        if (coupon.expiresAt < new Date()) {
            throw { error: 'Coupon expired' };
        }

        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            throw { error: 'Coupon usage limit reached' };
        }

        if (coupon.minOrderValue && orderTotal < coupon.minOrderValue) {
            throw { error: `Minimum order ₹${coupon.minOrderValue} required` };
        }

        let discount = 0;
        if (coupon.type === 'percentage') {
            discount = (orderTotal * coupon.value) / 100;
        } else if (coupon.type === 'flat') {
            discount = coupon.value;
        }

        discount = Math.min(discount, orderTotal);

        return {
            success: true,
            discount,
            finalAmount: orderTotal - discount,
            message: 'Coupon applied successfully'
        };

    } catch (error) {
        console.error("Error in Apply Coupon Provider ::", error);
        throw error;
    }
};

const deleteCouponProvider = async ({ id }) => {
  try {
      await prisma.coupon.delete({
          where: { id }
      });

      return {
          message: 'Coupon deleted successfully',
      };
  } catch (error) {
      console.error("Error in Delete Coupon Provider ::", error);
      throw error;
  }
};

  
  module.exports = {
    createCouponProvider,
    updateCouponProvider,
    applyCouponProvider,
    getAllCouponsProvider,
    deleteCouponProvider
  };