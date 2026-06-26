// Order Routes - Define all order endpoints

// TODO: Import express Router
const express = require('express');
const router = express.Router();
// TODO: Import orderController
const orderController = require('../controllers/orderController');
const orderItemController = require('../controllers/orderItemController');
// TODO: Define routes:
// router.get('/', orderController.getAllOrders);
router.get('/', orderController.getAllOrders);
// router.get('/:order_id', orderController.getOrderById);
router.get('/:order_id', orderController.getOrderById);
// router.post('/', orderController.createOrder);
router.post('/', orderController.createOrder);  
// router.put('/:order_id', orderController.updateOrder);
router.put('/:order_id', orderController.updateOrder);
// router.delete('/:order_id', orderController.deleteOrder);
router.delete('/:order_id', orderController.deleteOrder);

// Stretch feature: Add item to existing order
router.post('/:order_id/items', orderItemController.addItemToOrder);

// TODO: Export router
module.exports = router