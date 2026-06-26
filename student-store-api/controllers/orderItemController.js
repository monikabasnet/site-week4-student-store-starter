// OrderItem Controller - Business logic and request handling

// TODO: Import OrderItem model
const OrderItem = require('../models/orderItem');
// TODO: Create controller functions:
// - getAllOrderItems(req, res) - Handle GET /order-items
const getAllOrderItems = async (req, res) => {
    try {
        const orderItems = await OrderItem.findAll();
        res.status(200).json(orderItems);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch order items' });
    }
}
// - addItemToOrder(req, res) - Handle POST /orders/:order_id/items
const addItemToOrder = async (req, res) => {
    try {
        const { order_id } = req.params;
        const { product_id, quantity, price } = req.body;

        // Validate required fields
        if (!product_id || !quantity || !price) {
            return res.status(400).json({ error: 'Missing required fields: product_id, quantity, and price are required' });
        }

        const orderItem = await OrderItem.addToOrder(order_id, {
            product_id: parseInt(product_id),
            quantity: parseInt(quantity),
            price: parseFloat(price)
        });

        res.status(201).json(orderItem);
    } catch (error) {
        console.error('Error adding item to order:', error);
        res.status(500).json({ error: 'Failed to add item to order: ' + error.message });
    }
}

// TODO: Export all controller functions
module.exports = { getAllOrderItems, addItemToOrder };