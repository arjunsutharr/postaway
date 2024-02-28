import { errorLoggerMiddleware } from "../middlewares/logger.middleware.js";

export class CustomErrorHandler extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const appLevelErrorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomErrorHandler) {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "server error! Please Try Later!!";
    res.status(err.statusCode).json({ success: false, error: err.message });
  } else {
    console.log(err);
    errorLoggerMiddleware(err, req, res, next);
    res.status(500).json({
      success: false,
      error: "server error! Please try again Later!!",
    });
  }
};
