const Product = require('../models/Product');
const Category = require('../models/Category');

// Hiển thị danh sách sản phẩm
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('category', 'name')
            .sort({ createdAt: -1 });

        res.render('pages/products/index', {
            title: 'Quản lý sản phẩm',
            products
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('pages/error', {
            title: 'Lỗi',
            message: 'Có lỗi xảy ra khi tải danh sách sản phẩm'
        });
    }
};

// Hiển thị form thêm sản phẩm
exports.getAddProduct = async (req, res) => {
    try {
        const categories = await Category.find();
        res.render('pages/products/add', {
            title: 'Thêm sản phẩm mới',
            categories
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('pages/error', {
            title: 'Lỗi',
            message: 'Có lỗi xảy ra khi tải form thêm sản phẩm'
        });
    }
};

// Xử lý thêm sản phẩm
exports.postAddProduct = async (req, res) => {
    try {
        const { name, slug, description, price, category, stock } = req.body;
        
        const product = new Product({
            name,
            slug,
            description,
            price: Number(price),
            category,
            stock: Number(stock),
            images: req.files ? req.files.map(file => file.path) : []
        });

        await product.save();
        req.flash('success', 'Thêm sản phẩm thành công');
        res.redirect('/products');
    } catch (error) {
        console.error('Error:', error);
        req.flash('error', 'Có lỗi xảy ra khi thêm sản phẩm');
        res.redirect('/products/add');
    }
};

// Hiển thị form sửa sản phẩm
exports.getEditProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        const categories = await Category.find();
        
        if (!product) {
            req.flash('error', 'Không tìm thấy sản phẩm');
            return res.redirect('/products');
        }

        res.render('pages/products/edit', {
            title: 'Sửa sản phẩm',
            product,
            categories
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('pages/error', {
            title: 'Lỗi',
            message: 'Có lỗi xảy ra khi tải form sửa sản phẩm'
        });
    }
};

// Xử lý sửa sản phẩm
exports.postEditProduct = async (req, res) => {
    try {
        const { name, slug, description, price, category, stock } = req.body;
        
        const product = await Product.findById(req.params.id);
        if (!product) {
            req.flash('error', 'Không tìm thấy sản phẩm');
            return res.redirect('/products');
        }

        product.name = name;
        product.slug = slug;
        product.description = description;
        product.price = Number(price);
        product.category = category;
        product.stock = Number(stock);
        
        if (req.files && req.files.length > 0) {
            product.images = req.files.map(file => file.path);
        }

        await product.save();
        req.flash('success', 'Cập nhật sản phẩm thành công');
        res.redirect('/products');
    } catch (error) {
        console.error('Error:', error);
        req.flash('error', 'Có lỗi xảy ra khi cập nhật sản phẩm');
        res.redirect(`/products/edit/${req.params.id}`);
    }
};

// Xử lý xóa sản phẩm
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            req.flash('error', 'Không tìm thấy sản phẩm');
            return res.redirect('/products');
        }

        await product.remove();
        req.flash('success', 'Xóa sản phẩm thành công');
        res.redirect('/products');
    } catch (error) {
        console.error('Error:', error);
        req.flash('error', 'Có lỗi xảy ra khi xóa sản phẩm');
        res.redirect('/products');
    }
}; 