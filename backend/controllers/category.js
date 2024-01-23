const {
  findAllCategories,
  saveCategory,
  findCategoryById,
  findCategoryByName,
  updateCategory,
} = require("../dao/category");
const { validateInputWithSchema } = require("../utils/errorHandler");
const { categorySchema } = require("../services/validations/schemas/category");

function transform(category) {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
  };
}

async function getAllCategories(req, res, next) {
  try {
    const categories = await findAllCategories();
    return res.json({
      data: categories.map((cat) => transform(cat)),
      success: true,
    });
  } catch (err) {
    next(err);
  }
}
async function createCategory(req, res, next) {
  try {
    const data = req.body;
    const value = validateInputWithSchema(data, categorySchema, res);

    // check if category with the name already exists
    const existingCategory = await findCategoryByName(value.name);
    if (existingCategory) {
      res.status(400);
      throw new Error("Category already exists");
    }

    const category = await saveCategory(value); // value = {name, description}
    return res.json({
      data: transform(category),
      success: true,
    });
  } catch (err) {
    next(err);
  }
}
async function update(req, res, next) {
  try {
    const data = req.body;
    const id = req.params.categoryId;
    if (!id) {
      res.status(400);
      throw new Error("Category already exists!");
    }

    const value = validateInputWithSchema(data, categorySchema, res);

    // check if category with the id already exists
    const existingCategory = await findCategoryById(id);
    if (!existingCategory) {
      res.status(400);
      throw new Error("Category with given id doesn't exist!");
    }

    // check if the new category name already exists
    const existingCategoryName = await findCategoryByName(value.name);
    if (existingCategoryName) {
      res.status(400);
      throw new Error("Category with given name already exists!");
    }
    let category = existingCategory;
    category.name = value.name;
    category.description = value.description;
    category = await updateCategory(category);
    return res.json({
      data: transform(category),
      success: true,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllCategories,
  createCategory,
  update,
};
