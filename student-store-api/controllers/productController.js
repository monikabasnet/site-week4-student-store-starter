// Product Controller - Business logic and request handling

// TODO: Import Product model
const Product = require('../models/product');

// TODO: Create controller functions:
// - getAllProducts(req, res) - Handle GET /products
const getAllProducts = async (req, res) => {
    try {
        // Extract query parameters from request
        const { category, sort } = req.query;

        // Pass filters to the model
        const products = await Product.findAll({ category, sort });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
}
// - getProductById(req, res) - Handle GET /products/:id
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
}
// - createProduct(req, res) - Handle POST /products
const createProduct = async (req, res) => {
    try {
        console.log('Received product data:', req.body);
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product: ' + error.message });
    }
}
// - updateProduct(req, res) - Handle PUT /products/:id
const updateProduct = async (req, res) => {
    try {
        const product = await Product.update(req.params.id, req.body);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
}
// - deleteProduct(req, res) - Handle DELETE /products/:id
const deleteProduct = async (req, res) => {
    try {
        await Product.delete(req.params.id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
}

// TODO: Export all controller functions
module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };