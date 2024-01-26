function validateInputWithSchema(data, schema, res) {
  const { value, error } = schema.validate(data);
  if (error) {
    res.status(400);
    throw new Error(error.details.map((err) => err.message)[0]);
  }
  return value;
}

module.exports = {
  validateInputWithSchema,
};
