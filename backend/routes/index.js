const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/authMiddleware');

// Controllers
const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');
const dashboardController = require('../controllers/dashboardController');
const productController = require('../controllers/productController');

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../public/uploads', 
            file.fieldname.includes('product') ? 'products' : 'categories'
        );
        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        cb(null, filetypes.test(file.mimetype) && filetypes.test(path.extname(file.originalname).toLowerCase()));
    }
});

// Auth routes
router.get('/login', authMiddleware.guestOnly, authController.showLoginForm);
router.post('/login', authMiddleware.guestOnly, authController.login);
router.get('/logout', authMiddleware.requireAuth, authController.logout);

// Redirect root to dashboard
router.get('/', (req, res) => res.redirect('/dashboard'));
router.get('/dashboard', authMiddleware.requireAuth, dashboardController.index);

// Category routes
const categoryRoutes = express.Router();
categoryRoutes.use(authMiddleware.requireAuth);

categoryRoutes.get('/', categoryController.index);
categoryRoutes.get('/create', categoryController.showCreateForm);
categoryRoutes.post('/create', upload.single('categoryImage'), categoryController.create);
categoryRoutes.get('/edit/:id', categoryController.showEditForm);
categoryRoutes.post('/edit/:id', upload.single('categoryImage'), categoryController.update);
categoryRoutes.delete('/:id', categoryController.delete);
categoryRoutes.put('/:id/status', categoryController.updateStatus);

router.use('/categories', categoryRoutes);

// Product routes
const productRoutes = express.Router();
productRoutes.use(authMiddleware.requireAuth);

productRoutes.get('/', productController.index);
productRoutes.get('/create', productController.showCreateForm);
productRoutes.post('/create', upload.array('productImages', 5), productController.create);
productRoutes.get('/edit/:id', productController.showEditForm);
productRoutes.post('/edit/:id', upload.array('productImages', 5), productController.update);
productRoutes.delete('/:id', productController.delete);

router.use('/products', productRoutes);

module.exports = router; 