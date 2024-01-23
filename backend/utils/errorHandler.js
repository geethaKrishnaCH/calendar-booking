function validateInputWithSchema(data, schema, res) {
  const { value, error } = schema.validate(data);
  if (error) {
    return res.status(400).json({
      message: error.details.map((err) => err.message)[0],
      success: false,
    });
  }
  return value;
}

module.exports = {
  validateInputWithSchema,
};
