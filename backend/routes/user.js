const express = require("express");
const { isAuthenticated } = require("../services/middleware");
const { getProfile } = require("../controllers/user");
const {
  getBookingsByUser,
  getUpcomingBookingsByUser,
} = require("../controllers/booking");

const router = express.Router();

router.get("/profile", isAuthenticated, getProfile);
router.get("/bookings", isAuthenticated, getBookingsByUser);
router.get("/bookings/upcoming", isAuthenticated, getUpcomingBookingsByUser);

module.exports = router;
