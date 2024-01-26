const express = require("express");
const { isAuthenticated } = require("../services/middleware");
const {
  createUserBooking,
  getUserBookings,
} = require("../controllers/userBooking");

const router = express.Router();

router.get("/", isAuthenticated, getUserBookings);
router.post("/add", isAuthenticated, createUserBooking);

module.exports = router;
