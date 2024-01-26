const Joi = require("joi");

const createUserBookingSchema = Joi.object({
  booking: Joi.string().required(),
  subSlotId: Joi.string().optional(),
});

module.exports = {
  createUserBookingSchema,
};
