const mongoose = require("mongoose");
const UserBooking = require("../models/userBooking");

async function saveUserBooking(data) {
  const userBooking = new UserBooking(data);
  await userBooking.save();
  return userBooking;
}

async function findUserBookings(user, startDate, endDate, category) {
  const bookingFilters = {
    "bookingDetails.startTime": { $gte: startDate },
    "bookingDetails.endTime": { $lt: endDate },
  };
  if (!!category) {
    bookingFilters["bookingDetails.category"] = category;
  }
  const pipeline = [
    { $match: { user: new mongoose.Types.ObjectId(user) } },
    {
      $lookup: {
        from: "bookings",
        localField: "booking",
        foreignField: "_id",
        as: "bookingDetails",
      },
    },
    {
      $match: bookingFilters,
    },
    { $unwind: "$bookingDetails" },
    {
      $project: {
        _id: 1,
        bookedAt: 1,
        bookingStatus: 1,
        subSlotId: 1,
        bookingDetails: {
          _id: 1,
          title: 1,
          description: 1,
          startTime: 1,
          endTime: 1,
          category: 1,
          user: 1,
          maxParticipants: 1,
        },
      },
    },
  ];
  const bookings = await UserBooking.aggregate(pipeline);
  return bookings;
}

async function findBookedUsers(booking) {
  const bookedUsers = await UserBooking.find({ booking });
  return bookedUsers;
}
module.exports = {
  saveUserBooking,
  findUserBookings,
  findBookedUsers,
};
