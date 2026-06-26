// OrderItem Routes - Define all order item endpoints
const express = require('express');
const router = express.Router();
// TODO: Import express Router
// TODO: Import orderItemController
const orderItemController = require('../controllers/orderItemController');
// TODO: Define routes:
// GET /order-items - Get all order items
router.get('/', orderItemController.getAllOrderItems);

// TODO: Export router
module.exports = router;    