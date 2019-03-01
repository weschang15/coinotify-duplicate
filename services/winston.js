const { createLogger, format, transports } = require("winston");
const { combine, prettyPrint, simple, json, colorize } = format;

const logger = createLogger({
  level: "info",
  format: json(),
  transports: [
    new transports.File({
      format: simple(),
      filename: "logfile.log",
      handleExceptions: false
    }),
    new transports.File({
      level: "error",
      filename: "errors.log",
      handleExceptions: true
    })
  ],
  exitOnError: false
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: combine(colorize(), prettyPrint(), simple()),
      handleExceptions: true
    })
  );
}

logger.stream = {
  write: function(message, encoding) {
    logger.info(message);
  }
};

module.exports = logger;
