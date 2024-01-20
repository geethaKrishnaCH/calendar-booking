const express = require("express");
const {
  getAllCategories,
  createCategory,
  update,
} = require("../controllers/category");

const router = express.Router();

router.get("/", getAllCategories);
router.post("/", createCategory);
router.post("/:categoryId", update);

module.exports = router;
