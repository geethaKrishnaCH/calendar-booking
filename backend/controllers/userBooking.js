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
  try {
    const user = req.user;
    const { startDate, endDate, category } = req.query;
    const startTime = new Date(startDate);
    const endDateTemp = new Date(endDate);
    endDateTemp.setDate(endDateTemp.getDate() + 1);
    const endTime = new Date(endDateTemp);
    const bookings = await findUserBookings(
      user.id,
      startTime,
      endTime,
      category
    );
    return res.json({
      data: bookings,
      success: true,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { createUserBooking, getUserBookings };
