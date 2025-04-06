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
            console.log(`Báo cáo cho năm: ${year}, tháng: ${month}`);

            // Tính ngày đầu tháng và cuối tháng
            const startOfMonth = moment(`${year}-${month}-01`).startOf('month').toDate();
            const endOfMonth = moment(`${year}-${month}-01`).endOf('month').toDate();
            console.log(`Ngày đầu tháng: ${startOfMonth}, Ngày cuối tháng: ${endOfMonth}`);

            // Tính ngày đầu năm và cuối năm
            const startOfYear = moment(`${year}-01-01`).startOf('year').toDate();
            const endOfYear = moment(`${year}-12-31`).endOf('year').toDate();

            // Kiểm tra số lượng đơn hàng đã hoàn thành trong năm
            const completedOrdersInYear = await Order.countDocuments({
                orderStatus: 'Đã giao hàng',
                paymentStatus: 'Đã thanh toán',
                createdAt: {
                    $gte: startOfYear,
                    $lte: endOfYear
                }
            });
            console.log(`Số đơn hàng đã hoàn thành trong năm ${year}: ${completedOrdersInYear}`);

            // Lấy dữ liệu doanh thu theo tháng trong năm
            const monthlyRevenue = await Order.aggregate([
                {
                    $match: {
                        orderStatus: 'Đã giao hàng',
                        paymentStatus: 'Đã thanh toán',
                        createdAt: {
                            $gte: startOfYear,
                            $lte: endOfYear
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
            
            console.log(`Kết quả doanh thu theo tháng:`, JSON.stringify(monthlyRevenue));

            // Kiểm tra số lượng đơn hàng trong tháng đã chọn
            const completedOrdersInMonth = await Order.countDocuments({
                orderStatus: 'Đã giao hàng',
                paymentStatus: 'Đã thanh toán',
                createdAt: {
                    $gte: startOfMonth,
                    $lte: endOfMonth
                }
            });
            console.log(`Số đơn hàng đã hoàn thành trong tháng ${month}/${year}: ${completedOrdersInMonth}`);

            // Lấy dữ liệu chi tiết của tháng được chọn
            const monthlyDetails = await Order.aggregate([
                {
                    $match: {
                        orderStatus: 'Đã giao hàng',
                        paymentStatus: 'Đã thanh toán',
                        createdAt: {
                            $gte: startOfMonth,
                            $lte: endOfMonth
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
            ]).then(result => {
                console.log(`Chi tiết doanh thu tháng ${month}:`, JSON.stringify(result));
                return result[0] || { totalRevenue: 0, orderCount: 0, avgOrderValue: 0 };
            });

            // Thống kê theo phương thức thanh toán
            const paymentMethodStats = await Order.aggregate([
                {
                    $match: {
                        orderStatus: 'Đã giao hàng',
                        paymentStatus: 'Đã thanh toán',
                        createdAt: {
                            $gte: startOfMonth,
                            $lte: endOfMonth
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
            
            console.log(`Thống kê theo phương thức thanh toán:`, JSON.stringify(paymentMethodStats));

            // Format dữ liệu cho biểu đồ
            const chartData = Array(12).fill(0);
            monthlyRevenue.forEach(item => {
                chartData[item._id - 1] = item.total;
            });
            
            console.log(`Dữ liệu biểu đồ:`, JSON.stringify(chartData));

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