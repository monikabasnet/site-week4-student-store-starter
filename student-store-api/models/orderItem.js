// OrderItem Model - Database queries using Prisma

// TODO: Import Prisma Client
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
// TODO: Create OrderItem class with static methods:


// - addToOrder(orderId, data) - Add item to existing order
class OrderItem{
    // - findAll() - Get all order items
    static async findAll(){
        return await prisma.orderItem.findMany();
    }

    // - create(data) - Create new order item
    static async create(data){
        return await prisma.orderItem.create({data});
    }

    // - addToOrder(orderId, data) - Add item to existing order
    static async addToOrder(orderId, data){
        return await prisma.orderItem.create({
            data: {
                ...data,
                order_id: parseInt(orderId)
            }
        })
    }
}
// TODO: Export the OrderItem class
module.exports = OrderItem;