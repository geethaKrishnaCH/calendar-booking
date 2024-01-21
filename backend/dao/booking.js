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

async function getBookingsUsingFilters(filters) {
  return await Booking.find(filters).select(
    "title description startTime endTime category user maxParticipants"
  );
}

async function getBookingDetailsById(id) {
  return await Booking.findById(id);
}

module.exports = {
  saveBooking,
  saveBookings,
  updateBooking,
  getBookingsUsingFilters,
  getBookingDetailsById,
};
