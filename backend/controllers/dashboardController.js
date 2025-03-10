const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

class DashboardController {
    async index(req, res, next) {
        try {
            // Đếm số lượng danh mục
            const categoryCount = await Category.countDocuments();
            
            // Đếm số lượng sản phẩm
            const productCount = await Product.countDocuments();
            
            // Đếm số lượng đơn hàng
            const orderCount = await Order.countDocuments();

            // Đếm số lượng người dùng
            const userCount = await User.countDocuments({ role: 'user' });
            
            // Tính tổng doanh thu từ đơn hàng hoàn thành
            const totalRevenue = await Order.aggregate([
                {
                    $match: { status: 'completed' }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$totalAmount' }
                    }
                }
            ]).then(result => result[0]?.total || 0);

            // Lấy đơn hàng mới nhất
            const recentOrders = await Order.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('user', 'name email');

            // Lấy sản phẩm mới nhất
            const recentProducts = await Product.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('category', 'name');

            res.render('pages/dashboard', {
                title: 'Tổng quan',
                stats: {
                    categoryCount,
                    productCount,
                    orderCount,
                    userCount,
                    totalRevenue
                },
                recentOrders,
                recentProducts,
                messages: req.flash()
            });
        } catch (error) {
            console.error('Lỗi dashboard:', error);
            req.flash('error', 'Có lỗi xảy ra khi tải trang tổng quan');
            res.render('pages/dashboard', {
                title: 'Tổng quan',
                stats: {
                    categoryCount: 0,
                    productCount: 0,
                    orderCount: 0,
                    userCount: 0,
                    totalRevenue: 0
                },
                recentOrders: [],
                recentProducts: [],
                messages: req.flash()
            });
        }
    }
}

module.exports = new DashboardController(); 