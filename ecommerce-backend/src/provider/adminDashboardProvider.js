const prisma = require('../prisma');

const getDashboardData = async () => {
    try {
        const [orders, products] = await Promise.all([
            prisma.order.findMany({ where: { status: 'SHIPPED' } }),
            prisma.product.findMany(),
        ]);

        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const lowStockCount = products.filter(p => p.stock <= 5).length;
        const inStockCount = products.filter(p => p.stock > 0).length;

        return {
            totalOrders: orders.length,
            totalRevenue,
            inStockCount,
            lowStockCount,
        };
    } catch (err) {
        console.error("Error in Dashboard Provider ::", err);
        throw err;
    }
};

module.exports = {
    getDashboardData,
};