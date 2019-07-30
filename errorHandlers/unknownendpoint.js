// Error handling middleware.
// This function handles bad requests with unknown endpoints
module.exports = (request, response) =>
  response.status(404).send({ error: "unknown endpoint" });
