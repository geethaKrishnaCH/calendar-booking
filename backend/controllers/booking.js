const {
  saveBooking,
  saveBookings,
  updateBooking,
  getBookingsUsingFilters,
  getBookingDetailsById,
} = require("../dao/booking");
const { DAYS_IN_A_WEEK } = require("../utils/constants");
const {
  createBookingSchema,
  updateBookingSchema,
} = require("../services/validations/schemas/booking");
const {
  validateInputWithSchema,
} = require("../services/validations/errorHandler");

async function createBooking(req, res, next) {
  const data = req.body;

  // validate booking info
  validateInputWithSchema(data, createBookingSchema, res);
  try {
    const startTime = data.startTime;
    const endTime = data.endTime;
    const { repeatFrequency, repeatedDays, repeatEndDate } = data;
    if (!repeatFrequency || repeatFrequency === "Do Not Repeat") {
      const bookingData = createBookingData(data, startTime, endTime);
      // save booking
      await saveBooking(bookingData);
    } else if (repeatFrequency === "Daily") {
      if (!repeatEndDate) {
        res.status(400);
        throw new Error("Please select booking reccurence end time");
      }
      const bookingTimeSlots = createBookingTimeSlotsForDateRange(
        startTime,
        endTime,
        repeatEndDate
      );
      console.log(bookingTimeSlots);
      const bookingItems = bookingTimeSlots.map((booking) =>
        createBookingData(data, booking.startTime, booking.endTime)
      );

      // save all bookings
      await saveBookings(bookingItems);
    } else if (repeatFrequency === "Weekly") {
      if (!repeatEndDate) {
        res.status(400);
        throw new Error("Please select booking reccurence end time");
      }
      const bookingTimeSlots = createBookingTimeSlotsOnWeeklyBasis(
        startTime,
        endTime,
        repeatedDays,
        repeatEndDate
      );
      console.log(bookingTimeSlots);
      const bookingItems = bookingTimeSlots.map((booking) =>
        createBookingData(data, booking.startTime, booking.endTime)
      );

      // save all bookings
      saveBookings(bookingItems);
    }

    return res.json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
}
async function updateBookingDetails(req, res, next) {
  try {
    const data = req.body;

    // validate booking info
    validateInputWithSchema(data, updateBookingSchema, res);

    const startTime = data.startTime;
    const endTime = data.endTime;

    const bookingData = createBookingData(data, startTime, endTime);
    // update booking
    await updateBooking(bookingData);

    return res.json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
}
async function getAllBookings(req, res) {
  try {
    const { category, bookingDate } = req.query;
    let query = {};
    if (category) {
      query.category = category;
    }

    if (bookingDate) {
      const date = new Date(bookingDate);
      const startDate = new Date(bookingDate); // Parse bookingDate as a Date object
      const endDate = new Date(date.setDate(date.getDate() + 1));
      query.startTime = { $gte: startDate };
      query.endTime = { $lt: endDate };
    }

    const bookings = await getBookingsUsingFilters(query);
    return res.json({
      data: bookings,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
}
async function getBookingDetails(req, res, next) {
  try {
    const { bookingId } = req.params;
    const booking = await getBookingDetailsById(bookingId);
    return res.json({
      data: booking,
      success: true,
    });
  } catch (err) {
    next(err);
  }
}
async function getBookingsByUser(req, res, next) {
  try {
    const { userId } = req.params;
    const { category, bookingDate } = req.query;
    let query = { user: userId };
    if (category) {
      query.category = category;
    }

    if (bookingDate) {
      const date = new Date(bookingDate);
      const startDate = new Date(bookingDate); // Parse bookingDate as a Date object
      const endDate = new Date(date.setDate(date.getDate() + 1));
      query.startTime = { $gte: startDate };
      query.endTime = { $lt: endDate };
    }

    const bookings = await getBookingsUsingFilters(query);
    return res.json({
      data: bookings,
      success: true,
    });
  } catch (err) {
    next(err);
  }
}

function createSubSlots(
  eventStartTime,
  eventEndTime,
  slotDurationMinutes,
  bufferMinutes
) {
  const eventStartTimeInMillis = new Date(eventStartTime).getTime();
  const eventEndTimeInMillis = new Date(eventEndTime).getTime();
  const bufferTime = bufferMinutes * 60 * 1000; // Convert minutes to milliseconds
  const slotDuration = slotDurationMinutes * 60 * 1000; // Convert minutes to milliseconds
  const subSlots = [];
  let currentSlotStartTime = eventStartTimeInMillis;
  while (currentSlotStartTime < eventEndTimeInMillis) {
    const slotEndTime = currentSlotStartTime + slotDuration;

    // Ensure next slot doesn't go beyond eventEndTime
    const adjustedEndTime = Math.min(slotEndTime, eventEndTimeInMillis);
    const nextSlotStartTime = adjustedEndTime + bufferTime;

    subSlots.push({
      startTime: new Date(currentSlotStartTime),
      endTime: new Date(adjustedEndTime),
      isBooked: false,
    });
    currentSlotStartTime = nextSlotStartTime; // Start next slot after buffer
  }

  return subSlots;
}

function createBookingData(bookingData, startTime, endTime) {
  let subSlots;
  if (bookingData.subSlotInfo && bookingData.subSlotInfo.duration) {
    const { duration, buffer = 0 } = bookingData.subSlotInfo;
    subSlots = createSubSlots(startTime, endTime, duration, buffer);
  }
  bookingData = {
    category: bookingData.category,
    user: bookingData.user,
    title: bookingData.title,
    description: bookingData.description,
    startTime: startTime,
    endTime: endTime,
    maxParticipants: bookingData.maxParticipants,
    location: bookingData.location,
    metadata: bookingData.metadata,
  };
  if (subSlots && subSlots.length > 0) {
    bookingData.subSlots = subSlots;
  }
  return bookingData;
}

function createBookingTimeSlotsForDateRange(
  startTimeStr,
  endTimeStr,
  endDateStr
) {
  const timeSlots = [];

  const startTime = new Date(startTimeStr);
  const endTime = new Date(endTimeStr);
  let currentDate = new Date(startTimeStr);
  const endDate = new Date(endDateStr);
  endDate.setHours(endTime.getHours(), endTime.getMinutes());
  while (currentDate <= endDate) {
    // Create a new date object for each day, keeping the original times
    const dateWithStartTime = new Date(currentDate);
    dateWithStartTime.setHours(startTime.getHours(), startTime.getMinutes());

    const dateWithEndTime = new Date(currentDate);
    dateWithEndTime.setHours(endTime.getHours(), endTime.getMinutes());
    timeSlots.push({ startTime: dateWithStartTime, endTime: dateWithEndTime });

    currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    console.log(currentDate <= endDate);
  }

  return timeSlots;
}

function createBookingTimeSlotsOnWeeklyBasis(
  startTimeStr,
  endTimeStr,
  daysOfTheWeek,
  endDateStr
) {
  const timeSlots = [];

  const startTime = new Date(startTimeStr);
  const endTime = new Date(endTimeStr);
  let currentDate = new Date(startTimeStr);
  const endDate = new Date(endDateStr);
  while (currentDate <= endDate) {
    if (daysOfTheWeek.includes(DAYS_IN_A_WEEK.at(currentDate.getDay()))) {
      // Create a new date object for each day, keeping the original times
      const dateWithStartTime = new Date(currentDate);
      dateWithStartTime.setHours(startTime.getHours(), startTime.getMinutes());

      const dateWithEndTime = new Date(currentDate);
      dateWithEndTime.setHours(endTime.getHours(), endTime.getMinutes());
      timeSlots.push({
        startTime: dateWithStartTime,
        endTime: dateWithEndTime,
      });
    }

    currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
  }

  return timeSlots;
}

module.exports = {
  createBooking,
  getBookingDetails,
  updateBookingDetails,
  getAllBookings,
  getBookingsByUser,
};
