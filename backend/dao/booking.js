const { default: mongoose } = require("mongoose");
const Booking = require("../models/booking");

async function saveBooking(bookingData) {
  const booking = new Booking(bookingData);
  await booking.save();
  return booking;
}

async function updateBooking(bookingData) {
  return await Booking.findByIdAndUpdate(bookingData.id, bookingData);
}

async function saveBookings(bookingsData) {
  return await Booking.insertMany(bookingsData);
}

async function findBookingsUsingFilters(filters) {
  return await Booking.find(filters).select(
    "title description startTime endTime category user maxParticipants"
  );
}

async function findBookingDetailsById(id) {
  const booking = await Booking.findById(id);
  return booking;
}

async function findBookingCreator(bookingId) {
  const creator = Booking.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(bookingId) } },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "creator",
      },
    },
    { $unwind: "$creator" },
    {
      $project: {
        _id: "$creator._id",
        username: "$creator.username",
        email: "$creator.email",
      },
    },
  ]);
  return creator;
}

module.exports = {
  saveBooking,
  saveBookings,
  updateBooking,
  findBookingsUsingFilters,
  findBookingDetailsById,
  findBookingCreator,
};
