const { findAllCategories, saveCategory,
    findCategoryById, findCategoryByName, updateCategory } = require("../services/category");
const { categorySchema } = require("../utils/validations/category");

function transform(category) {
    return { id: category.id, name: category.name, description: category.description }
}

async function getAllCategories(req, res) {
    try {
        const categories = await findAllCategories();
        return res.status(200).json({
            data: categories.map(cat => transform(cat)),
            success: true
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message,
            success: false
        })
    }
}
async function createCategory(req, res) {
    const data = req.body;
    const { value, error } = categorySchema.validate(data);
    if (error) {
        return res.stutus(400).json({
            message: "Invalid request",
            success: false
        });
    }
    // check if category with the name already exists
    const existingCategory = await findCategoryByName(value.name);
    if (existingCategory) {
        return res.status(400).json({
            message: "Category already exists",
            success: false
        })
    }

    const category = await saveCategory(value); // value = {name, description}
    return res.status(200).json({
        data: transform(category),
        success: true
    });
}
async function update(req, res) {
    const data = req.body;
    const id = req.params.categoryId;
    if (!id) {
        return res.status(400).json({
            message: "categoryId must be valid",
            success: false
        })
    }

    const { value, error } = categorySchema.validate(data);

    if (error) {
        return res.status(400).json({
            message: "Invalid request",
            success: false,
            data: error
        })
    }

    // check if category with the id already exists
    const existingCategory = await findCategoryById(id);
    if (!existingCategory) {
        return res.status(400).json({
            message: "Category with given id doesn't exist",
            success: false
        })
    }

    // check if the new category name already exists 
    const existingCategoryName = await findCategoryByName(value.name);
    if (existingCategoryName) {
        return res.status(400).json({
            message: "Category with given name already exist",
            success: false
        })
    }
    let category = existingCategory;
    category.name = value.name;
    category.description = value.description;
    category = await updateCategory(category);
    return res.status(200).json({
        data: transform(category),
        success: true
    })
}

module.exports = {
    getAllCategories,
    createCategory,
    update
}