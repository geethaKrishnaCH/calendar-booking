const express = require("express");
const {
  createBooking,
  getBookingDetails,
  updateBookingDetails,
  getAllBookings,
  getBookingsByUser,
} = require("../controllers/booking");
const { isAuthenticated } = require("../utils/middleware");
const router = express.Router();

router.post("/", isAuthenticated, createBooking);
router.put("/", isAuthenticated, updateBookingDetails);
router.get("/", getAllBookings);
router.get("/:bookingId", getBookingDetails);
router.get("/user/:userId", isAuthenticated, getBookingsByUser);

module.exports = router;
