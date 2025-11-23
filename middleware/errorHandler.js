export const errorHandler = (err, req, res, next) => {
  console.error("[ERROR_DETAILS]", {
    message: err.message,
    stack: err.stack,
  })

  const status = err.status || 500
  const message = err.message || "Internal server error"

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { error: err.message }),
  })
  // Do not call next() from the error handler after sending a response.
}
