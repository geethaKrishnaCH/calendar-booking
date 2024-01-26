const express = require("express");
const router = express.Router();
const authRoutes = require("./auth");
const userRoutes = require("./user");
const categoryRoutes = require("./category");
const bookingRoutes = require("./booking");
const userBookingRoutes = require("./userBooking");

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/category", categoryRoutes);
router.use("/booking", bookingRoutes);
router.use("/userBooking", userBookingRoutes);

module.exports = router;
