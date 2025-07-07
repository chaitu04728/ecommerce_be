const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Import the Product model
const { protect, admin } = require('../middleware/auth'); // Import auth middleware


router.get('/', async (req, res) => {
    try {
        const products = await Product.find({}); // Find all products
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        // Handle invalid MongoDB ID format
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Product ID format' });
        }
        res.status(500).json({ message: error.message });
    }
});


router.post('/', protect, admin, async (req, res) => {
    const { name, price, description, image, brand, category, countInStock } = req.body;

    // Basic validation
    if (!name || !price || !description || !image || !brand || !category || countInStock === undefined) {
        return res.status(400).json({ message: 'Please enter all required fields' });
    }

    try {
        const product = new Product({
            name,
            price,
            description,
            image,
            brand,
            category,
            countInStock,
            user: req.user._id, // User who created the product (from auth middleware)
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne(); // Use deleteOne() for Mongoose 6+
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Product ID format' });
        }
        res.status(500).json({ message: error.message });
    }
});



router.put('/:id', protect, admin, async (req, res) => {
    const { name, price, description, image, brand, category, countInStock } = req.body;

    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.image = image || product.image;
            product.brand = brand || product.brand;
            product.category = category || product.category;
            product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Product ID format' });
        }
        res.status(400).json({ message: error.message });
    }
});


module.exports = router;