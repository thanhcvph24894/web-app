const Category = require('../../models/Category');

// @desc    Lấy danh sách danh mục đang active
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true })
            .select('name slug description image')
            .sort('order');

        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Lỗi lấy danh mục:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
}; 