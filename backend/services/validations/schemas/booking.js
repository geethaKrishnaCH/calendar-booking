const Joi = require("joi");
const {
  DAYS_IN_A_WEEK,
  REPEAT_FREQUENCIES,
} = require("../../../utils/constants");

const createBookingSchema = Joi.object({
  category: Joi.string().required(),
  user: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().trim().allow(null),
  startTime: Joi.date().required(),
  endTime: Joi.date().required().greater(Joi.ref("startTime")), // Ensure endTime is after startTime
  subSlotInfo: Joi.object({
    duration: Joi.number(), // in minutes
    buffer: Joi.number(), // in minutes
  }).optional(), // optional
  maxParticipants: Joi.number().integer().min(1).allow(null), // Optional, but at least 1 if provided
  repeatFrequency: Joi.string()
    .valid(...REPEAT_FREQUENCIES)
    .allow(null), // Optional with allowed values
  repeatedDays: Joi.array().items(Joi.string().valid(...DAYS_IN_A_WEEK)),
  repeatEndDate: Joi.date().allow(null), // Optional
  location: Joi.object({
    onlineMode: Joi.boolean(),
    meetingLink: Joi.string(),
    address: Joi.string(),
  }).allow(null), // Optional location
  metadata: Joi.object().allow(null), // Optional metadata
});

const updateBookingSchema = Joi.object({
  id: Joi.string().required(),
  category: Joi.string().required(),
  user: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().trim().allow(null),
  startTime: Joi.date().required(),
  endTime: Joi.date().required().greater(Joi.ref("startTime")), // Ensure endTime is after startTime
  subSlotInfo: Joi.object({
    duration: Joi.number(), // in minutes
    buffer: Joi.number(), // in minutes
  }).optional(), // optional
  maxParticipants: Joi.number().integer().min(1).allow(null), // Optional, but at least 1 if provided
  location: Joi.object({
    onlineMode: Joi.boolean(),
    meetingLink: Joi.string(),
    address: Joi.string(),
  }).allow(null), // Optional location
  metadata: Joi.object().allow(null), // Optional metadata
});

module.exports = {
  createBookingSchema,
  updateBookingSchema,
};
