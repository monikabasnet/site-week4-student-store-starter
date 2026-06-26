const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());
// TODO: Import routes
 const productRoutes = require('../routes/productRoutes');
const orderRoutes = require('../routes/orderRoutes');
const orderItemRoutes = require('../routes/orderItemRoutes');

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Student Store API!');
});

// TODO: Use routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/order-items', orderItemRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
