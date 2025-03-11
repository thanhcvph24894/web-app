const Category = require('../models/Category');
const Product = require('../models/Product');

class CategoryService {
    async getAllCategories() {
        return Category.find()
            .populate('parent', 'name')
            .sort({ name: 1 });
    }

    async getCategoryById(id) {
        const category = await Category.findById(id).populate('parent', 'name');
        if (!category) throw new Error('Không tìm thấy danh mục');
        return category;
    }

    async findByName(name, excludeId = null) {
        const query = { 
            name: { $regex: new RegExp(`^${name}$`, 'i') }
        };
        if (excludeId) query._id = { $ne: excludeId };
        return Category.findOne(query);
    }

    async createCategory(categoryData) {
        try {
            return await Category.create(categoryData);
        } catch (error) {
            if (error.code === 11000) throw new Error('Tên danh mục đã tồn tại');
            throw error;
        }
    }

    async updateCategory(id, updateData) {
        try {
            const category = await Category.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
            if (!category) throw new Error('Không tìm thấy danh mục');
            return category;
        } catch (error) {
            if (error.code === 11000) throw new Error('Tên danh mục đã tồn tại');
            throw error;
        }
    }

    async deleteCategory(id) {
        const category = await Category.findByIdAndDelete(id);
        if (!category) throw new Error('Không tìm thấy danh mục');
        return category;
    }

    async hasChildren(id) {
        return (await Category.countDocuments({ parent: id })) > 0;
    }

    async hasProducts(id) {
        return (await Product.countDocuments({ category: id })) > 0;
    }
}

module.exports = new CategoryService(); 