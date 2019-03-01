class AppError extends Error {
  constructor(message, status, operational) {
    super(message);
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);

    // Custom properties to attach to AppError
    this.status = status || 500;
    this.operational = operational || true;
  }
}

module.exports = AppError;
