const { handleError, logErrors } = require("@helpers");

exports.errorHandler = async (error, req, res, next) => {
  logErrors(error, req);
  handleError(error, res);
};
