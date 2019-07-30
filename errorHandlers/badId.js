// Error handling middleware.
// This function only handles bad id errors
module.exports = (error, request, response, next) => {
  console.log("Error middleware: ", error.message);
  // pseudo typechecking of error
  if (error.name === "CastError" && error.kind == "ObjectId") {
    return response.status(400).send({ error: "malformatted id" });
  }
  // if it's not an id error, this middleware passes it to express's default error handling function
  next(error);
};
