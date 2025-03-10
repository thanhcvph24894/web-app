const Product = require('../models/Product');
const Category = require('../models/Category');
const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

class ProductController {
    // Hiển thị danh sách sản phẩm
    async index(req, res, next) {
        try {
            const products = await Product.find()
                .populate('category', 'name')
                .sort({ createdAt: -1 });
            
            res.render('pages/products/index', {
                title: 'Quản lý sản phẩm',
                products,
                messages: req.flash()
            });
        } catch (error) {
            next(error);
        }
    }

    // Hiển thị form tạo sản phẩm
    async showCreateForm(req, res, next) {
        try {
            const categories = await Category.find({ isActive: true });
            res.render('pages/products/create', {
                title: 'Thêm sản phẩm mới',
                categories,
                messages: req.flash()
            });
        } catch (error) {
            next(error);
        }
    }

    // Xử lý tạo sản phẩm mới
    async create(req, res, next) {
        try {
            const productData = {
                name: req.body.name.trim(),
                description: req.body.description ? req.body.description.trim() : '',
                price: parseFloat(req.body.price),
                category: req.body.category,
                stock: parseInt(req.body.stock),
                isActive: req.body.isActive === 'on',
                slug: slugify(req.body.name, { lower: true, locale: 'vi', strict: true })
            };

            // Xử lý hình ảnh
            if (req.files && req.files.length > 0) {
                productData.images = req.files.map(file => '/uploads/products/' + file.filename);
            }

            await Product.create(productData);
            req.flash('success', 'Thêm sản phẩm thành công');
            res.redirect('/products');
        } catch (error) {
            // Xóa file đã upload nếu có lỗi
            if (req.files) {
                req.files.forEach(file => {
                    const filePath = path.join(__dirname, '../public/uploads/products', file.filename);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                });
            }
            next(error);
        }
    }

    // Hiển thị form chỉnh sửa sản phẩm
    async showEditForm(req, res, next) {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                throw new Error('Không tìm thấy sản phẩm');
            }

            const categories = await Category.find({ isActive: true });
            
            res.render('pages/products/edit', {
                title: 'Chỉnh sửa sản phẩm',
                product,
                categories,
                messages: req.flash()
            });
        } catch (error) {
            next(error);
        }
    }

    // Xử lý cập nhật sản phẩm
    async update(req, res, next) {
        try {
            const productId = req.params.id;
            const product = await Product.findById(productId);
            
            if (!product) {
                throw new Error('Không tìm thấy sản phẩm');
            }

            const updateData = {
                name: req.body.name.trim(),
                description: req.body.description ? req.body.description.trim() : '',
                price: parseFloat(req.body.price),
                category: req.body.category,
                stock: parseInt(req.body.stock),
                isActive: req.body.isActive === 'on',
                slug: slugify(req.body.name, { lower: true, locale: 'vi', strict: true })
            };

            // Xử lý hình ảnh mới
            if (req.files && req.files.length > 0) {
                // Xóa ảnh cũ
                if (product.images && product.images.length > 0) {
                    product.images.forEach(image => {
                        const imagePath = path.join(__dirname, '../public', image);
                        if (fs.existsSync(imagePath)) {
                            fs.unlinkSync(imagePath);
                        }
                    });
                }
                updateData.images = req.files.map(file => '/uploads/products/' + file.filename);
            }

            await Product.findByIdAndUpdate(productId, updateData, { new: true });
            req.flash('success', 'Cập nhật sản phẩm thành công');
            res.redirect('/products');
        } catch (error) {
            // Xóa file đã upload nếu có lỗi
            if (req.files) {
                req.files.forEach(file => {
                    const filePath = path.join(__dirname, '../public/uploads/products', file.filename);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                });
            }
            next(error);
        }
    }

    // Xử lý xóa sản phẩm
    async delete(req, res, next) {
        try {
            const product = await Product.findById(req.params.id);
            
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy sản phẩm'
                });
            }

            // Xóa ảnh sản phẩm
            if (product.images && product.images.length > 0) {
                product.images.forEach(image => {
                    const imagePath = path.join(__dirname, '../public', image);
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                });
            }

            await Product.findByIdAndDelete(req.params.id);
            res.json({
                success: true,
                message: 'Xóa sản phẩm thành công'
            });
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Có lỗi xảy ra khi xóa sản phẩm'
            });
        }
    }
}

module.exports = new ProductController(); 