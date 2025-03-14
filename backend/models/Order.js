const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        },
        variant: {
            size: String,
            color: String
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        fullName: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        ward: String,
        district: String,
        city: String,
        note: String
    },
    status: {
        type: String,
        enum: ['Chờ xác nhận', 'Đã xác nhận', 'Đang giao hàng', 'Đã giao hàng', 'Đã hủy'],
        default: 'Chờ xác nhận'
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'VNPAY', 'MOMO'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Chưa thanh toán', 'Đã thanh toán', 'Hoàn tiền'],
        default: 'Chưa thanh toán'
    },
    shippingFee: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    coupon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema); 