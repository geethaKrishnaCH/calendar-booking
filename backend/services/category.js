const Category = require('../models/category')

async function findAllCategories() {
    return await Category.find();
}

async function saveCategory(data) {
    const category = new Category(data);
    await category.save();
    return category;
}

async function updateCategory(category) {
    return await category.save()
}

async function findCategoryById(id) {
    return await Category.findById(id);
}

async function findCategoryByName(name) {
    return await Category.findOne({ name })
}

module.exports = {
    findAllCategories,
    saveCategory,
    updateCategory,
    findCategoryById,
    findCategoryByName
}