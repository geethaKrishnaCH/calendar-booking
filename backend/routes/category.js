const express = require("express");
const {
  getAllCategories,
  createCategory,
  update,
} = require("../controllers/category");
const { isAuthenticated } = require("../services/middleware");

const router = express.Router();

router.get("/", getAllCategories);
router.post("/", isAuthenticated, createCategory);
router.post("/:categoryId", isAuthenticated, update);

module.exports = router;
