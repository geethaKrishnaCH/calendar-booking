const Joi = require("joi");
const { ROLES } = require("../../../utils/constants");

const userRegistrationReqSchema = Joi.object({
  username: Joi.string().alphanum().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  roles: Joi.array().items(Joi.string().valid(...ROLES)), // roles allowed in the application
});

const loginRequestSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = {
  userRegistrationReqSchema,
  loginRequestSchema,
};
