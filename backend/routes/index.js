const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authController = require('../controllers/authController');

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

module.exports = router; 