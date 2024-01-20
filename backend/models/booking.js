const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    trim: true, // Remove leading/trailing whitespace
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  // Additional optional fields
  subSlots: [
    {
      startTime: Date,
      endTime: Date,
      isBooked: Boolean,
      user: {
        // booked user
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  maxParticipants: Number,
  repeatFrequency: String,
  repeatEndDate: Date,
  metadata: {}, // Flexible object for custom fields
});

// Virtual field for duration
bookingSchema.virtual("duration").get(function () {
  return this.endTime.diff(this.startTime);
});

// Indexes for efficient querying
bookingSchema.index({ category: 1, startTime: 1, endTime: 1 });

module.exports = mongoose.model("Bookings", bookingSchema);
