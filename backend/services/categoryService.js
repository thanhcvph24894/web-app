const Category = require('../models/Category');
const Product = require('../models/Product');

class CategoryService {
    async getAllCategories() {
        try {
            const categories = await Category.find()
                .populate('parent', 'name')
                .sort({ name: 1 });
            return categories;
        } catch (error) {
            throw error;
        }
    }

    async getCategoryById(id) {
        try {
            const category = await Category.findById(id).populate('parent', 'name');
            if (!category) {
                throw new Error('Không tìm thấy danh mục');
            }
            return category;
        } catch (error) {
            throw error;
        }
    }

    async findByName(name) {
        try {
            return await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        } catch (error) {
            throw error;
        }
    }

    async findByNameExcept(name, excludeId) {
        try {
            return await Category.findOne({
                name: { $regex: new RegExp(`^${name}$`, 'i') },
                _id: { $ne: excludeId }
            });
        } catch (error) {
            throw error;
        }
    }

    async createCategory(categoryData) {
        try {
            const category = await Category.create(categoryData);
            return category;
        } catch (error) {
            if (error.code === 11000) {
                throw new Error('Tên danh mục đã tồn tại');
            }
            throw error;
        }
    }

    async updateCategory(id, updateData) {
        try {
            const category = await Category.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );
            if (!category) {
                throw new Error('Không tìm thấy danh mục');
            }
            return category;
        } catch (error) {
            if (error.code === 11000) {
                throw new Error('Tên danh mục đã tồn tại');
            }
            throw error;
        }
    }

    async deleteCategory(id) {
        try {
            const category = await Category.findByIdAndDelete(id);
            if (!category) {
                throw new Error('Không tìm thấy danh mục');
            }
            return category;
        } catch (error) {
            throw error;
        }
    }

    async hasChildren(id) {
        try {
            const childrenCount = await Category.countDocuments({ parent: id });
            return childrenCount > 0;
        } catch (error) {
            throw error;
        }
    }

    async hasProducts(id) {
        try {
            const productsCount = await Product.countDocuments({ category: id });
            return productsCount > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new CategoryService(); 