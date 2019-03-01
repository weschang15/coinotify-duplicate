const { ValidationError } = require("express-validation");
const { pick } = require("lodash");
const { AppError } = require("@errors");
const winston = require("@services/winston");

const formatJoiError = e => {
  const details = Object.values(e.details);
  return details.map(err => ({
    path: err.context.key,
    message: err.message
  }));
};

exports.withCatch = fn => fn.then(data => [null, data]).catch(err => [err]);

exports.extractErrors = e => {
  if (e.name !== "ValidationError") {
    return [{ path: "name", message: e.message || "Something went wrong" }];
  }

  if (e.isJoi) {
    return formatJoiError(e);
  }

  const errors = Object.values(e.errors);
  return errors.map(error => pick(error, ["path", "message"]));
};

exports.handleError = (err, res) => {
  if (err instanceof ValidationError) {
    return res.status(err.status).json(err);
  } else if (err instanceof AppError) {
    return res.status(err.status).send(err.message);
  }

  if (process.env.NODE_ENV !== "production") {
    return res.status(500).send(err.stack);
  }

  return res.status(500);
};

exports.catchErrors = fn => (req, res, next) => {
  fn(req, res, next).catch(next);
};

exports.logErrors = (err, req) => {
  const validationErrors =
    err instanceof ValidationError
      ? err.errors
          .map(error => {
            return `${error.field} in ${error.location}: ${
              error.messages.length > 1
                ? error.messages.join(" - ")
                : error.messages[0]
            }`;
          })
          .join(" - ")
      : "";

  winston.error(
    `${err.status || 500} - ${err.message} - ${validationErrors} - ${
      req.originalUrl
    } - ${req.method} - ${req.ip}`
  );
};
