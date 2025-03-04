const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const multer = require('multer');
const path = require('path');

// Cấu hình multer cho upload ảnh
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/products')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Chỉ chấp nhận file ảnh!'), false);
        }
        cb(null, true);
    }
});

// Middleware kiểm tra đăng nhập
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        req.flash('error', 'Vui lòng đăng nhập để tiếp tục');
        res.redirect('/login');
    }
};

// Auth routes
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/logout', authController.getLogout);

// Dashboard route
router.get('/', isAuthenticated, dashboardController.getDashboard);

// Product routes
router.get('/products', isAuthenticated, productController.getProducts);
router.get('/products/add', isAuthenticated, productController.getAddProduct);
router.post('/products/add', isAuthenticated, upload.array('images', 5), productController.postAddProduct);
router.get('/products/edit/:id', isAuthenticated, productController.getEditProduct);
router.post('/products/edit/:id', isAuthenticated, upload.array('images', 5), productController.postEditProduct);
router.post('/products/delete/:id', isAuthenticated, productController.deleteProduct);

module.exports = router; 