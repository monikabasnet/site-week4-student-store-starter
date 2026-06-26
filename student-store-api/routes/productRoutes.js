// Product Routes - Define all product endpoints

// TODO: Import express Router
const express = require('express');
const router = express.Router();
// TODO: Import productController
const productController = require('../controllers/productController');


// TODO: Define routes:
// router.get('/', productController.getAllProducts);
router.get('/', productController.getAllProducts);
// router.get('/:id', productController.getProductById);
router.get('/:id', productController.getProductById);
// router.post('/', productController.createProduct);
router.post('/', productController.createProduct);
// router.put('/:id', productController.updateProduct);
router.put('/:id', productController.updateProduct);
// router.delete('/:id', productController.deleteProduct);
router.delete('/:id', productController.deleteProduct);
// TODO: Export router
module.exports = router;