export const invalidRoutesHandlerMiddleware = (req, res, next) => {
  return res.status(404).json({
    success: false,
    msg: `Invalid Path: ${req.originalUrl}`,
  });
};
