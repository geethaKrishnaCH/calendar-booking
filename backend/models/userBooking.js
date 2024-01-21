const mongoose = require("mongoose");

const userBookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  bookedAt: { type: Date, default: Date.now },
  bookingStatus: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "CANCELLED"],
    default: "PENDING",
  },
  subSlotId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking.subSlots" },
});
