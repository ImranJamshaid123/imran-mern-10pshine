
export const errorHandler = (err, req, res, next) => {
  // Log error using Pino
  req.log.error(err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};