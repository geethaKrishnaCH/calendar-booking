const express = require("express");
const {
  createBooking,
  getBookingDetails,
  updateBookingDetails,
  getAllBookings,
  getUpcomingBookings,
  getParticipants,
} = require("../controllers/booking");
const { isAuthenticated } = require("../services/middleware");
const router = express.Router();

router.post("/add", isAuthenticated, createBooking);
router.put("/", isAuthenticated, updateBookingDetails);
router.get("/", getAllBookings);
router.get("/upcoming", getUpcomingBookings);
router.get("/:bookingId", getBookingDetails);
router.get("/:bookingId/participants", getParticipants);

module.exports = router;
