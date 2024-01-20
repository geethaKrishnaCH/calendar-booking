const Joi = require("joi");

const userRegistrationReqSchema = Joi.object({
  username: Joi.string().alphanum().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  roles: Joi.array().items(Joi.string().valid("ADMIN", "USER")), // roles allowed in the application
});

const loginRequestSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = {
  userRegistrationReqSchema,
  loginRequestSchema,
};
