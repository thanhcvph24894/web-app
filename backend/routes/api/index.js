const express = require('express');
const router = express.Router();

const categoryController = require('../../controllers/api/categoryController');
const productController = require('../../controllers/api/productController');

// Category routes
router.get('/categories', categoryController.getCategories);

// Product routes
router.get('/products', productController.getProducts);
router.get('/products/:slug', productController.getProduct);

module.exports = router; 