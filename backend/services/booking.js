const Joi = require('joi');

const bookingValidationSchema = Joi.object({
  category: Joi.objectId().required(),
  user: Joi.objectId().required(),
  title: Joi.string().required().min(3).max(50), // Adjust length limits as needed
  description: Joi.string().allow(''), // Optional, trimmed by Mongoose
  startTime: Joi.date().required(),
  endTime: Joi.date().required().greater(Joi.ref('startTime')),
  subSlots: Joi.array().items(
    Joi.object({
      startTime: Joi.date().required(),
      endTime: Joi.date().required().greater(Joi.ref('startTime')),
      isBooked: Joi.boolean(),
      user: Joi.objectId()
    })
  ).allow(null), // Optional
  participants: Joi.array().items(Joi.objectId()),
  maxParticipants: Joi.number().integer(),
  repeatFrequency: Joi.string().allow(null), // Optional
  repeatEndDate: Joi.date().allow(null), // Optional
  metadata: Joi.object() // Flexible, no specific validation for now
});

module.exports = bookingValidationSchema;
