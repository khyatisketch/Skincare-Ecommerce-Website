// import { sendOrderConfirmation } from '../utils/email.js'
const { sendOrderConfirmation } = require("../utils/email");
const prisma = require('../prisma');

const createOrderProvider = async ({ userId, items, shippingAddress, couponCode, total }) => {
  const productIds = items.map(i => parseInt(i.productId, 10));

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } }
  });

  const orderItems = items.map(i => {
    const product = products.find(p => p.id === parseInt(i.productId, 10));
    if (!product) throw new Error(`Product not found: ${i.productId}`);
    if (product.stock < i.quantity) throw new Error(`Insufficient stock for product ID ${i.productId}`);

    return {
      productId: product.id,
      quantity: i.quantity,
      price: product.price,
    };
  });

   total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Start transaction
  const order = await prisma.$transaction(async (tx) => {
    let discount = 0;

    // if (couponCode) {
    //   const coupon = await tx.coupon.findUnique({
    //     where: { code: couponCode.toUpperCase() }
    //   });

    if (couponId) {
      const coupon = await tx.coupon.findUnique({ where: { id: couponId } });

      if (!coupon) {
        throw new Error('Invalid coupon code');
      }

      if (coupon.expiresAt < new Date()) {
        throw new Error('Coupon expired');
      }

      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        throw new Error('Coupon usage limit reached');
      }

      if (coupon.minOrderValue && total < coupon.minOrderValue) {
        throw new Error(`Minimum order ₹${coupon.minOrderValue} required for this coupon`);
      }

      // Apply discount
      if (coupon.type === 'percentage') {
        discount = (total * coupon.value) / 100;
      } else if (coupon.type === 'flat') {
        discount = coupon.value;
      }

      discount = Math.min(discount, total);
      total = total - discount;

      // Increment coupon usage
      await tx.coupon.update({
        where: { id: coupon.id },
        data: {
          usedCount: { increment: 1 }
        }
      });
    }

    // Create the order
    const createdOrder = await tx.order.create({
      data: {
        userId,
        total,
        discount,
        shippingAddress,
        couponCode: coupon?.code || null,
        orderItems: {
          create: orderItems
        }
      },
      include: {
        orderItems: true
      }
    });

    // Decrement product stock
    for (const item of orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });
    }

    return createdOrder;
  });

  return order;
};



const getMyOrdersProvider = async ({ userId }) => {
    try {
      const orders = await prisma.order.findMany({
        where: { userId },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      console.log('Orders:', orders)
      

        return {
            orders,
        };
    } catch (error) {
        console.error("Error in Get My Orders Provider ::", error);
        throw error;
    }
};

const getAllOrdersProvider = async ({ limit, offset }) => {
  try {
      const orders = await prisma.order.findMany({
          include: {
              user: true,
              orderItems: {
                  include: {
                      product: true,
                  },
              },
          },
          orderBy: { createdAt: 'desc' },
          skip: offset,
          take: limit,
      });

      return {
          orders,
          count: orders.length,
      };
  } catch (error) {
      console.error("Error in Get All Orders Provider ::", error);
      throw error;
  }
};

const updateOrderStatusProvider = async (orderId, { status }) => {
  try {
    const orderExists = await prisma.order.findUnique({
      where: { id: Number(orderId) }
    });

    if (!orderExists) {
      const error = new Error(`Order with id ${orderId} not found`);
      error.statusCode = 404;
      throw error;
    }

    const order = await prisma.order.update({
      where: { id: Number(orderId) },
      data: { status },
    });

    return order;
  } catch (error) {
    console.error("Error in updateOrderStatus Provider ::", error);
    throw error;
  }
};

const updateShippingInfoProvider = async (id, { shippingAddress, trackingNumber }) => {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: { shippingAddress, trackingNumber },
    });

    return updatedOrder;
  } catch (error) {
    console.error("Error in updateShippingInfo Provider ::", error);
    throw error;
  }
};

const resendOrderConfirmationProvider = async ({ userId, orderId }) => {
  try {
      const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: { user: true },
      });

      if (!order || order.userId !== userId) {
          throw {
              status: 403,
              message: 'Unauthorized or order not found',
          };
      }

      if (!order.user.email) {
          throw {
              status: 400,
              message: 'No email associated with user',
          };
      }

      await sendOrderConfirmation(order.user.email, {
          total: order.total,
          trackingNumber: order.trackingNumber,
          orderId: order.id 
      });

      return {
          message: 'Order confirmation email resent successfully',
      };
  } catch (error) {
      console.error("Error in resendOrderConfirmationProvider ::", error);
      if (error.status && error.message) throw error;
      throw {
          status: 500,
          message: 'Failed to resend confirmation email',
      };
  }
};

  
  module.exports = {
    createOrderProvider,
    getMyOrdersProvider,
    getAllOrdersProvider,
    updateOrderStatusProvider,
    updateShippingInfoProvider,
    resendOrderConfirmationProvider
  };