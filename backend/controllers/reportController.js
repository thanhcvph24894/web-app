const Order = require('../models/Order');
const moment = require('moment');
moment.locale('vi'); // Đặt locale thành tiếng Việt

class ReportController {
    async index(req, res) {
        try {
            if (!req.session.user || req.session.user.role !== 'admin') {
                req.flash('error', 'Bạn không có quyền truy cập trang này');
                return res.redirect('/dashboard');
            }

            const year = parseInt(req.query.year) || new Date().getFullYear();
            const month = parseInt(req.query.month) || new Date().getMonth() + 1;

            // Lấy dữ liệu doanh thu theo tháng trong năm
            const monthlyRevenue = await Order.aggregate([
                {
                    $match: {
                        status: 'Đã giao hàng',
                        paymentStatus: 'Đã thanh toán',
                        createdAt: {
                            $gte: new Date(year, 0, 1),
                            $lt: new Date(year + 1, 0, 1)
                        }
                    }
                },
                {
                    $group: {
                        _id: { $month: '$createdAt' },
                        total: { $sum: '$totalAmount' }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ]);

            // Lấy dữ liệu chi tiết của tháng được chọn
            const monthlyDetails = await Order.aggregate([
                {
                    $match: {
                        status: 'Đã giao hàng',
                        paymentStatus: 'Đã thanh toán',
                        createdAt: {
                            $gte: new Date(year, month - 1, 1),
                            $lt: new Date(year, month, 1)
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: '$totalAmount' },
                        orderCount: { $sum: 1 },
                        avgOrderValue: { $avg: '$totalAmount' }
                    }
                }
            ]).then(result => result[0] || { totalRevenue: 0, orderCount: 0, avgOrderValue: 0 });

            // Thống kê theo phương thức thanh toán
            const paymentMethodStats = await Order.aggregate([
                {
                    $match: {
                        status: 'Đã giao hàng',
                        paymentStatus: 'Đã thanh toán',
                        createdAt: {
                            $gte: new Date(year, month - 1, 1),
                            $lt: new Date(year, month, 1)
                        }
                    }
                },
                {
                    $group: {
                        _id: '$paymentMethod',
                        count: { $sum: 1 },
                        total: { $sum: '$totalAmount' }
                    }
                }
            ]);

            // Format dữ liệu cho biểu đồ
            const chartData = Array(12).fill(0);
            monthlyRevenue.forEach(item => {
                chartData[item._id - 1] = item.total;
            });

            res.render('pages/reports/index', {
                title: 'Báo cáo doanh thu',
                year,
                month,
                chartData,
                monthlyDetails,
                paymentMethodStats,
                moment,
                messages: req.flash()
            });
        } catch (error) {
            console.error('Lỗi báo cáo:', error);
            req.flash('error', 'Có lỗi xảy ra khi tải báo cáo');
            res.redirect('/dashboard');
        }
    }
}

module.exports = new ReportController(); 