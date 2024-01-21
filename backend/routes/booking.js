const express = require("express");
const {
  createBooking,
  getBookingDetails,
  updateBookingDetails,
  getAllBookings,
  getBookingsByUser,
} = require("../controllers/booking");
const router = express.Router();

router.post("/", createBooking);
router.put("/", updateBookingDetails);
router.get("/", getAllBookings);
router.get("/:bookingId", getBookingDetails);
router.get("/user/:userId", getBookingsByUser);

module.exports = router;
