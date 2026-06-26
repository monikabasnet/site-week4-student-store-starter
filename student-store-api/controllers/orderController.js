// Order Controller - Business logic and request handling

// TODO: Import Order and OrderItem models
const Order = require('../models/order');
// TODO: Create controller functions:
// - getAllOrders(req, res) - Handle GET /orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
}
// - getOrderById(req, res) - Handle GET /orders/:order_id
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.order_id);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch order' });
    }
}
// - createOrder(req, res) - Handle POST /orders (with transaction)
const createOrder = async (req, res) => {
    try {
        console.log('Received order request:', JSON.stringify(req.body, null, 2));

        // Check if request includes items (full order creation)
        if (req.body.items && req.body.items.length > 0) {
            console.log('Creating order with items');
            const order = await Order.createWithItems(req.body);
            res.status(201).json(order);
        } else {
            console.log('No items found in request, items:', req.body.items);
            res.status(400).json({ error: 'Order must include at least one item' });
        }
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order: ' + error.message });
    }
}
// - updateOrder(req, res) - Handle PUT /orders/:order_id
const updateOrder = async (req, res) => {
    try {
        console.log('Updating order:', req.params.order_id, req.body);
        const order = await Order.update(req.params.order_id, req.body);
        res.status(200).json(order);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Failed to update order: ' + error.message });
    }
}
// - deleteOrder(req, res) - Handle DELETE /orders/:order_id
const deleteOrder = async (req, res) => {
    try {
        await Order.delete(req.params.order_id);
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete order' });
    }
}

// TODO: Export all controller functions
module.exports = { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder };