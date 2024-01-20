const Joi = require("joi");

const categorySchema = Joi.object({
  id: Joi.string(),
  name: Joi.string().alphanum().required(),
  description: Joi.string(),
});

module.exports = {
  categorySchema,
};
