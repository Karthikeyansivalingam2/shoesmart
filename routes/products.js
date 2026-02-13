const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const PRODUCTS_FILE = path.join(__dirname, '../products.json');

const getProducts = () => {
    try {
        const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

const saveProducts = (products) => {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
};

// Get all products
router.get('/', (req, res) => {
    const products = getProducts();
    res.json(products);
});

// Get single product
router.get('/:id', (req, res) => {
    const products = getProducts();
    const product = products.find(p => p.id == req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// Add a new product (Admin)
router.post('/', (req, res) => {
    try {
        const products = getProducts();
        const newProduct = {
            id: Date.now(), // simple ID generation
            ...req.body,
            price: parseFloat(req.body.price),
            reviews: [] // Initialize with empty reviews
        };
        products.push(newProduct);
        saveProducts(products);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: "Failed to save product" });
    }
});

// Add a review to a product
router.post('/:id/reviews', (req, res) => {
    try {
        const products = getProducts();
        const productIndex = products.findIndex(p => p.id == req.params.id);

        if (productIndex === -1) return res.status(404).json({ message: "Product not found" });

        const review = {
            user: req.body.user || "Anonymous",
            rating: parseInt(req.body.rating),
            comment: req.body.comment,
            date: new Date().toISOString()
        };

        if (!products[productIndex].reviews) {
            products[productIndex].reviews = [];
        }

        products[productIndex].reviews.push(review);
        saveProducts(products);
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ error: "Failed to add review" });
    }
});

module.exports = router;
