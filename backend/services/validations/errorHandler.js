function validateInputWithSchema(data, schema, res) {
  const { value, error } = schema.validate(data);
  if (error) {
    return res.status(400).json({
      data: error,
      message: "Invalid request",
      success: false,
    });
  }
  return value;
}

module.exports = {
  validateInputWithSchema,
};
