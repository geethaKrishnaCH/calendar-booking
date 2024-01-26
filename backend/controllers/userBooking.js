const { saveUserBooking, findUserBookings } = require("../dao/userBooking");
const {
  validateInputWithSchema,
} = require("../services/validations/errorHandler");
const {
  createUserBookingSchema,
} = require("../services/validations/schemas/userBooking");

async function createUserBooking(req, res, next) {
  const data = req.body;
  const user = req.user;
  console.log(user);
  try {
    validateInputWithSchema(data, createUserBookingSchema, res);
    const userBookingData = { ...data, user: user.id };
    const userBooking = await saveUserBooking(userBookingData);
    return res.json({
      data: userBooking,
      success: true,
    });
  } catch (err) {
    next(err);
  }
}

async function getUserBookings(req, res, next) {
  const user = req.user;
  try {
    const bookings = await findUserBookings(user.id);
    return res.json({
      data: bookings,
      success: true,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { createUserBooking, getUserBookings };
