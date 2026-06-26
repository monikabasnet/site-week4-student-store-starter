// Product Model - Database queries using Prisma
const { PrismaClient } = require('@prisma/client')

// TODO: Import Prisma Client
const prisma = new PrismaClient()
// TODO: Create Product class with static methods:
// - findAll() - Get all products
// - findById(id) - Get product by ID
// - create(data) - Create new product
// - update(id, data) - Update product
// - delete(id) - Delete product

class Product {
    static async findAll() {
        return await prisma.product.findMany()
    }

    static async findById(id) {
        return await prisma.product.findUnique({
            where: { id: parseInt(id) }
        })
    }

    static async create(data) {
        return await prisma.product.create({ data })
    }

    
    static async delete(id) {
        return await prisma.product.delete({
            where: { id: parseInt(id) }
        })
    }

    static async update(id, data) {
        return await prisma.product.update({
            where: { id: parseInt(id) },
            data: data
        })
    }

    static async findAll(filters = {}) {
        const { category, sort } = filters;

        // Build the query options
        const queryOptions = {};

        // Add where clause for category filtering
        if (category) {
            queryOptions.where = {
                category: category
            };
        }

        // Add orderBy clause for sorting
        if (sort === 'price' || sort === 'name') {
            queryOptions.orderBy = {
                [sort]: 'asc'  // ascending order
            };
        }

        return await prisma.product.findMany(queryOptions);
    }

}

// TODO: Export the Product class
module.exports = Product;