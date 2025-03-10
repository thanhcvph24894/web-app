const categoryService = require('../services/categoryService');
const slugify = require('slugify');
const path = require('path');
const fs = require('fs');

class CategoryController {
    // Hiển thị danh sách danh mục
    async index(req, res, next) {
        try {
            const categories = await categoryService.getAllCategories();
            res.render('pages/categories/index', { 
                title: 'Quản lý danh mục',
                categories,
                messages: req.flash()
            });
        } catch (error) {
            next(error);
        }
    }

    // Hiển thị form tạo danh mục
    async showCreateForm(req, res, next) {
        try {
            const parentCategories = await categoryService.getAllCategories();
            res.render('pages/categories/create', { 
                title: 'Thêm danh mục mới',
                parentCategories,
                messages: req.flash()
            });
        } catch (error) {
            next(error);
        }
    }

    // Xử lý tạo danh mục mới
    async create(req, res, next) {
        try {
            // Validate dữ liệu đầu vào
            if (!req.body.name) {
                throw new Error('Tên danh mục là bắt buộc');
            }

            const categoryData = {
                name: req.body.name.trim(),
                description: req.body.description ? req.body.description.trim() : '',
                parent: req.body.parent || null,
                isActive: req.body.isActive === 'on',
                slug: slugify(req.body.name, { lower: true, locale: 'vi', strict: true })
            };

            // Kiểm tra tên danh mục đã tồn tại
            const existingCategory = await categoryService.findByName(categoryData.name);
            if (existingCategory) {
                throw new Error('Tên danh mục đã tồn tại');
            }

            // Kiểm tra parent category có tồn tại
            if (categoryData.parent) {
                const parentExists = await categoryService.getCategoryById(categoryData.parent);
                if (!parentExists) {
                    throw new Error('Danh mục cha không tồn tại');
                }
            }

            if (req.file) {
                // Kiểm tra và tạo thư mục nếu chưa tồn tại
                const uploadDir = path.join(__dirname, '../public/uploads/categories');
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                categoryData.image = '/uploads/categories/' + req.file.filename;
            }

            await categoryService.createCategory(categoryData);
            req.flash('success', 'Tạo danh mục thành công');
            res.redirect('/categories');
        } catch (error) {
            // Xóa file đã upload nếu có lỗi
            if (req.file) {
                const filePath = path.join(__dirname, '../public/uploads/categories', req.file.filename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            next(error);
        }
    }

    // Hiển thị form chỉnh sửa danh mục
    async showEditForm(req, res, next) {
        try {
            const category = await categoryService.getCategoryById(req.params.id);
            if (!category) {
                throw new Error('Không tìm thấy danh mục');
            }

            const parentCategories = await categoryService.getAllCategories();
            
            res.render('pages/categories/edit', {
                title: 'Chỉnh sửa danh mục',
                category,
                parentCategories: parentCategories.filter(c => !c._id.equals(category._id)),
                messages: req.flash()
            });
        } catch (error) {
            next(error);
        }
    }

    // Xử lý cập nhật danh mục
    async update(req, res, next) {
        try {
            const categoryId = req.params.id;

            // Validate dữ liệu đầu vào
            if (!req.body.name) {
                throw new Error('Tên danh mục là bắt buộc');
            }

            // Kiểm tra danh mục tồn tại
            const existingCategory = await categoryService.getCategoryById(categoryId);
            if (!existingCategory) {
                throw new Error('Không tìm thấy danh mục');
            }

            const updateData = {
                name: req.body.name.trim(),
                description: req.body.description ? req.body.description.trim() : '',
                parent: req.body.parent || null,
                isActive: req.body.isActive === 'on',
                slug: slugify(req.body.name, { lower: true, locale: 'vi', strict: true })
            };

            // Kiểm tra tên mới có bị trùng không
            const duplicateName = await categoryService.findByNameExcept(updateData.name, categoryId);
            if (duplicateName) {
                throw new Error('Tên danh mục đã tồn tại');
            }

            // Kiểm tra parent category
            if (updateData.parent) {
                if (updateData.parent === categoryId) {
                    throw new Error('Không thể chọn chính danh mục này làm danh mục cha');
                }
                const parentExists = await categoryService.getCategoryById(updateData.parent);
                if (!parentExists) {
                    throw new Error('Danh mục cha không tồn tại');
                }
            }

            if (req.file) {
                // Xóa ảnh cũ nếu có
                if (existingCategory.image) {
                    const oldImagePath = path.join(__dirname, '../public', existingCategory.image);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
                updateData.image = '/uploads/categories/' + req.file.filename;
            }

            await categoryService.updateCategory(categoryId, updateData);
            req.flash('success', 'Cập nhật danh mục thành công');
            res.redirect('/categories');
        } catch (error) {
            // Xóa file đã upload nếu có lỗi
            if (req.file) {
                const filePath = path.join(__dirname, '../public/uploads/categories', req.file.filename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            next(error);
        }
    }

    // Xử lý cập nhật trạng thái
    async updateStatus(req, res) {
        try {
            const categoryId = req.params.id;
            const { isActive } = req.body;

            // Kiểm tra danh mục tồn tại
            const category = await categoryService.getCategoryById(categoryId);
            if (!category) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Không tìm thấy danh mục' 
                });
            }

            await categoryService.updateCategory(categoryId, { isActive });
            res.json({ success: true, message: 'Cập nhật trạng thái thành công' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Xử lý xóa danh mục
    async delete(req, res, next) {
        try {
            const categoryId = req.params.id;
            
            // Kiểm tra danh mục tồn tại
            const category = await categoryService.getCategoryById(categoryId);
            if (!category) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Không tìm thấy danh mục' 
                });
            }

            // Kiểm tra xem có danh mục con không
            const hasChildren = await categoryService.hasChildren(categoryId);
            if (hasChildren) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Không thể xóa danh mục này vì có chứa danh mục con' 
                });
            }

            // Kiểm tra xem có sản phẩm nào thuộc danh mục này không
            const hasProducts = await categoryService.hasProducts(categoryId);
            if (hasProducts) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Không thể xóa danh mục này vì có chứa sản phẩm' 
                });
            }

            // Xóa ảnh nếu có
            if (category.image) {
                const imagePath = path.join(__dirname, '../public', category.image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

            await categoryService.deleteCategory(categoryId);
            res.json({ success: true, message: 'Xóa danh mục thành công' });
        } catch (error) {
            console.error('Lỗi khi xóa danh mục:', error);
            res.status(500).json({ 
                success: false, 
                message: error.message || 'Có lỗi xảy ra khi xóa danh mục' 
            });
        }
    }
}

module.exports = new CategoryController(); 