const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');
const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');
const dashboardController = require('../controllers/dashboardController');
const productController = require('../controllers/productController');
const fs = require('fs');

// Cấu hình multer cho upload ảnh
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../public/uploads', 
            file.fieldname === 'productImage' ? 'products' : 'categories'
        );
        // Tạo thư mục nếu chưa tồn tại
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // giới hạn 5MB
    },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Chỉ cho phép upload file ảnh (jpeg, jpg, png, gif)'));
    }
});

// Auth routes
router.get('/login', authMiddleware.guestOnly, authController.showLoginForm);
router.post('/login', authMiddleware.guestOnly, authController.login);
router.get('/logout', authMiddleware.requireAuth, authController.logout);

// Redirect root to dashboard
router.get('/', (req, res) => res.redirect('/dashboard'));

// Dashboard routes
router.get('/dashboard', authMiddleware.requireAuth, dashboardController.index);

// Category routes
router.get('/categories', authMiddleware.requireAuth, categoryController.index);
router.get('/categories/create', authMiddleware.requireAuth, categoryController.showCreateForm);
router.post('/categories/create', authMiddleware.requireAuth, upload.single('image'), categoryController.create);
router.get('/categories/edit/:id', authMiddleware.requireAuth, categoryController.showEditForm);
router.post('/categories/edit/:id', authMiddleware.requireAuth, upload.single('image'), categoryController.update);
router.delete('/categories/:id', authMiddleware.requireAuth, categoryController.delete);
router.put('/categories/:id/status', authMiddleware.requireAuth, categoryController.updateStatus);

// Product routes
router.get('/products', authMiddleware.requireAuth, productController.index);
router.get('/products/create', authMiddleware.requireAuth, productController.showCreateForm);
router.post('/products/create', authMiddleware.requireAuth, upload.array('productImages', 5), productController.create);
router.get('/products/edit/:id', authMiddleware.requireAuth, productController.showEditForm);
router.post('/products/edit/:id', authMiddleware.requireAuth, upload.array('productImages', 5), productController.update);
router.delete('/products/:id', authMiddleware.requireAuth, productController.delete);

module.exports = router; 