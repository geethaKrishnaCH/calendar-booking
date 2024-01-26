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
    trim: true,
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
  subSlots: [
    {
      startTime: Date,
      endTime: Date,
      isBooked: Boolean,
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Booked user (if applicable)
    },
  ],
  maxParticipants: Number,
  location: {
    onlineMode: {
      type: Boolean,
      default: false,
    },
    meetingLink: String,
    address: String,
  },
});

// Virtual field for duration
bookingSchema.virtual("duration").get(function () {
  const endTime = new Date(this.endTime);
  const startTime = new Date(this.startTime);
  const diffInMillis = endTime.getTime() - startTime.getTime();
  return `${diffInMillis / (1000 * 60)} min`;
});

// Indexes for efficient querying
bookingSchema.index({ category: 1, startTime: 1, endTime: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
