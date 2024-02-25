import winston from "winston";

// For client request logging
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "request-logging" },
  transports: [new winston.transports.File({ filename: "logs.txt" })],
});

export const loggerMiddleware = (req, res, next) => {
  if (!req.url.includes("user")) {
    const logData = `${new Date().toString()} request URL: ${
      req.originalUrl
    } reqBody: ${JSON.stringify(req.body)}`;
    logger.info(logData);
  }

  next();
};

// For error logging
const errorLogger = winston.createLogger({
  level: "error",
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: "errorLogs.txt" })],
});

export const errorLoggerMiddleware = (err, req, res, next) => {
  if (!req.url.includes("user")) {
    const logData = `${new Date().toString()} request URL: ${
      req.originalUrl
    } reqBody: ${JSON.stringify(req.body)} ${err}`;
    errorLogger.error(logData);
  } else {
    const logData = `${new Date().toString()} request URL: ${
      req.originalUrl
    } ${err}`;
    errorLogger.error(logData);
  }
};
