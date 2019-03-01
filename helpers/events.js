exports.handlePromiseRejection = () => {
  process.on("unhandledRejection", ex => {
    throw ex;
  });
};
