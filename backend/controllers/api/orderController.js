const Order = require('../../models/Order');
const Cart = require('../../models/Cart');
const Product = require('../../models/Product');

// Helper function to add base URL to product images
const addBaseUrlToProductImages = (product) => {
    const baseUrl = process.env.BASE_URL;
    if (product.images && product.images.length > 0) {
        product.images = product.images.map(image => 
            image.startsWith('http') ? image : `${baseUrl}${image}`
        );
    }
    return product;
};

// @desc    Lấy danh sách đơn hàng của người dùng
// @route   GET /api/v1/orders
// @access  Private
exports.getOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        // Lấy đơn hàng của user hiện tại
        const orders = await Order.find({ user: req.user.id })
            .sort('-createdAt')
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('items.product', 'name slug images price')
            .lean();

        // Đếm tổng số đơn hàng
        const total = await Order.countDocuments({ user: req.user.id });

        // Thêm base URL vào images của sản phẩm
        const ordersWithFullUrls = orders.map(order => {
            order.items = order.items.map(item => {
                if (item.product) {
                    item.product = addBaseUrlToProductImages(item.product);
                }
                return item;
            });
            return order;
        });

        res.json({
            success: true,
            data: {
                orders: ordersWithFullUrls,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Lỗi lấy đơn hàng:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
};

// @desc    Lấy chi tiết đơn hàng
// @route   GET /api/v1/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.product', 'name slug images price salePrice')
            .lean();

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        // Kiểm tra quyền truy cập
        if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Không có quyền truy cập đơn hàng này'
            });
        }

        // Thêm base URL vào images của sản phẩm
        order.items = order.items.map(item => {
            if (item.product) {
                item.product = addBaseUrlToProductImages(item.product);
            }
            return item;
        });

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Lỗi lấy chi tiết đơn hàng:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
};

// @desc    Tạo đơn hàng mới từ giỏ hàng
// @route   POST /api/v1/orders
// @access  Private
exports.createOrder = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;

        // Validate đầu vào
        if (!shippingAddress || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp địa chỉ giao hàng và phương thức thanh toán'
            });
        }

        // Kiểm tra các trường bắt buộc của địa chỉ
        if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp đầy đủ thông tin địa chỉ giao hàng'
            });
        }

        // Tìm giỏ hàng của user
        const cart = await Cart.findOne({ user: req.user.id })
            .populate('items.product');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Giỏ hàng trống'
            });
        }

        // Kiểm tra còn hàng và variant hợp lệ
        for (const item of cart.items) {
            const product = item.product;
            
            // Kiểm tra số lượng
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Sản phẩm ${product.name} chỉ còn ${product.stock} sản phẩm`
                });
            }
            
            // Kiểm tra variant hợp lệ
            if (item.variant && Object.keys(item.variant).length > 0) {
                // Kiểm tra màu sắc
                if (item.variant.color && product.colors && product.colors.length > 0) {
                    if (!product.colors.includes(item.variant.color)) {
                        return res.status(400).json({
                            success: false,
                            message: `Màu ${item.variant.color} không có sẵn cho sản phẩm ${product.name}`
                        });
                    }
                }
                
                // Kiểm tra kích thước
                if (item.variant.size && product.sizes && product.sizes.length > 0) {
                    if (!product.sizes.includes(item.variant.size)) {
                        return res.status(400).json({
                            success: false,
                            message: `Kích thước ${item.variant.size} không có sẵn cho sản phẩm ${product.name}`
                        });
                    }
                }
            }
        }

        // Tạo array items cho đơn hàng
        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.price,
            variant: item.variant || {}
        }));

        // Tính toán tổng tiền
        const totalAmount = cart.totalPrice;
        
        // Phí vận chuyển mặc định
        const shippingFee = 0; // Có thể tính toán dựa trên địa chỉ và cân nặng

        // Tạo đơn hàng mới
        const newOrder = await Order.create({
            user: req.user.id,
            items: orderItems,
            totalAmount: totalAmount + shippingFee,
            shippingAddress,
            paymentMethod,
            shippingFee,
            status: 'Chờ xác nhận',
            paymentStatus: paymentMethod === 'COD' ? 'Chưa thanh toán' : 'Đã thanh toán'
        });

        // Cập nhật số lượng sản phẩm (giảm stock, tăng sold)
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock: -item.quantity, sold: item.quantity }
            });
        }

        // Xóa giỏ hàng sau khi đặt hàng
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        // Lấy thông tin đơn hàng đầy đủ
        const order = await Order.findById(newOrder._id)
            .populate('items.product', 'name slug images price')
            .lean();

        // Thêm base URL vào images của sản phẩm
        order.items = order.items.map(item => {
            if (item.product) {
                item.product = addBaseUrlToProductImages(item.product);
            }
            return item;
        });

        res.status(201).json({
            success: true,
            data: order,
            message: 'Đặt hàng thành công'
        });
    } catch (error) {
        console.error('Lỗi tạo đơn hàng:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
};

// @desc    Hủy đơn hàng
// @route   PUT /api/v1/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        // Kiểm tra quyền truy cập
        if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Không có quyền hủy đơn hàng này'
            });
        }

        // Kiểm tra trạng thái đơn hàng
        if (order.status !== 'Chờ xác nhận' && order.status !== 'Đã xác nhận') {
            return res.status(400).json({
                success: false,
                message: 'Không thể hủy đơn hàng ở trạng thái này'
            });
        }

        // Cập nhật trạng thái đơn hàng
        order.status = 'Đã hủy';
        
        // Nếu đã thanh toán, cập nhật trạng thái thanh toán
        if (order.paymentStatus === 'Đã thanh toán') {
            order.paymentStatus = 'Hoàn tiền';
        }

        await order.save();

        // Cập nhật lại stock sản phẩm (tăng stock, giảm sold)
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity, sold: -item.quantity }
            });
        }

        // Lấy thông tin đơn hàng đầy đủ
        const updatedOrder = await Order.findById(order._id)
            .populate('items.product', 'name slug images price')
            .lean();

        // Thêm base URL vào images của sản phẩm
        updatedOrder.items = updatedOrder.items.map(item => {
            if (item.product) {
                item.product = addBaseUrlToProductImages(item.product);
            }
            return item;
        });

        res.json({
            success: true,
            data: updatedOrder,
            message: 'Hủy đơn hàng thành công'
        });
    } catch (error) {
        console.error('Lỗi hủy đơn hàng:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
}; 