const express = require("express");
const router = express.Router();
const userRoutes = require("./user");
const categoryRoutes = require("./category");
const bookingRoutes = require("./booking");

router.use("/user", userRoutes);
router.use("/category", categoryRoutes);
router.use("/booking", bookingRoutes);

module.exports = router;
