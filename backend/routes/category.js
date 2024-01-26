const express = require("express");
const {
  getAllCategories,
  createCategory,
  update,
} = require("../controllers/category");
const { isAuthenticated } = require("../services/middleware");

const router = express.Router();

router.get("/", getAllCategories);
router.post("/add", isAuthenticated, createCategory);
router.post("/update", isAuthenticated, update);

module.exports = router;
