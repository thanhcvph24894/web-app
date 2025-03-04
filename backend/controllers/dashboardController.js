const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

exports.getDashboard = async (req, res) => {
    try {
        // Lấy tổng số đơn hàng
        const totalOrders = await Order.countDocuments();

        // Lấy tổng doanh thu
        const orders = await Order.find({ orderStatus: 'Đã giao hàng' });
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

        // Lấy tổng số sản phẩm
        const totalProducts = await Product.countDocuments();

        // Lấy tổng số người dùng
        const totalUsers = await User.countDocuments({ role: 'user' });

        // Lấy đơn hàng mới nhất
        const latestOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name email');

        // Lấy sản phẩm bán chạy
        const bestSellers = await Product.find()
            .sort({ sold: -1 })
            .limit(5);

        res.render('pages/dashboard', {
            title: 'Dashboard',
            path: '/dashboard',
            totalOrders,
            totalRevenue,
            totalProducts,
            totalUsers,
            latestOrders,
            bestSellers
        });
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu dashboard:', error);
        res.status(500).render('pages/error', {
            title: 'Lỗi',
            message: 'Đã xảy ra lỗi khi tải trang'
        });
    }
}; 