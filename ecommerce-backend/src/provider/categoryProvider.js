const prisma = require('../prisma');

const createCategoryProvider = async ({ name}) => {
    try {
        const category = await prisma.category.create({
            data: { name},
        });

        return {
            message: 'Category created',
            data: category
        };
    } catch (error) {
        console.error("Error in Category Provider ::", error);
        throw error;
    }
};

const getAllCategoriesProvider = async () => {
    try {
        const categories = await prisma.category.findMany();
        return {
            data: categories,
        };
    } catch (error) {
        console.error("Error in Category Provider ::", error);
        throw error;
    }
};

const updateCategoryProvider = async ({ id, name }) => {
    try {
        const category = await prisma.category.update({
            where: { id },
            data: { name },
        });

        return category;
    } catch (error) {
        console.error("Error in updateCategory Provider ::", error);
        throw error;
    }
};

const deleteCategoryProvider = async ({ id }) => {
    try {
        await prisma.category.delete({
            where: { id },
        });

        return {
            message: 'Category deleted successfully',
        };
    } catch (error) {
        console.error("Error in deleteCategory Provider ::", error);
        throw error;
    }
};

module.exports = {
    createCategoryProvider,
    getAllCategoriesProvider,
    updateCategoryProvider,
    deleteCategoryProvider
};