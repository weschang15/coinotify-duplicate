const { User } = require("@models");
const { pick } = require("lodash");

exports.currentUser = async (req, res, next) => {
  const { user: id } = req.session;
  if (!id) {
    return next();
  }

  const user = await User.findById(id).populate("orders");
  req.user = pick(user, ["id", "firstName", "lastName", "email", "orders"]);

  console.log(
    `From currentUser middleware: ${JSON.stringify(req.user, null, 2)}`
  );
  next();
};
