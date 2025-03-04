const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    siteName: {
        type: String,
        required: true,
        default: 'Shop Quần Áo'
    },
    logo: String,
    favicon: String,
    email: {
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
    facebook: String,
    instagram: String,
    youtube: String,
    zalo: String,
    shippingPrice: {
        type: Number,
        default: 30000
    },
    freeShippingThreshold: {
        type: Number,
        default: 500000
    },
    maintenanceMode: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Setting', settingSchema); 