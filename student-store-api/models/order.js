// Order Model - Database queries using Prisma

// TODO: Import Prisma Client
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

// TODO: Create Order class with static methods:
class Order{
// - findAll() - Get all orders
static async findAll(){
    return await prisma.order.findMany();
}
// - findById(orderId) - Get order by ID with order items
static async findById(id){
    return await prisma.order.findUnique({
        where: {order_id: parseInt(id)},
        include: {
            order_items: true
        }
    })
}
// - create(data) - Create new order
static async create(data){
    return await prisma.order.create({data});
}

// - createWithItems(data) - Create order with items (transaction)
static async createWithItems(orderData) {
    const { customer_id, status = 'pending', items } = orderData;

    // Calculate total price by fetching product prices
    let total_price = 0;
    for (const item of items) {
        const product = await prisma.product.findUnique({
            where: { id: item.product_id }
        });
        if (!product) {
            throw new Error(`Product with id ${item.product_id} not found`);
        }
        total_price += parseFloat(product.price) * item.quantity;
    }

    // Create order with items in a transaction
    return await prisma.order.create({
        data: {
            customer_id,
            total_price,
            status,
            order_items: {
                create: items.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: 0 // Will be set by fetching product price
                }))
            }
        },
        include: {
            order_items: true
        }
    });
}
// - update(orderId, data) - Update order
static async update(id,data){
    return await prisma.order.update({
        where: {order_id :parseInt(id)},
        data: data
    })
}
// - delete(orderId) - Delete order\
static async delete(id){
    return await prisma.order.delete({
        where: {order_id :parseInt(id)}
    })
}
}
// TODO: Export the Order class
module.exports = Order;