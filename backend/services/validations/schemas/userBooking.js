const Joi = require("joi");

const createUserBookingSchema = Joi.object({
  booking: Joi.string().required(),
  subSlotId: Joi.string().optional().allow(null),
});

module.exports = {
  createUserBookingSchema,
};
