const { User } = require("@models");
const userController = {};

userController.create = async (req, res, next) => {
  const user = new User(req.body);
  user.password = await user.hashPassword({ password: user.password });
  const result = await user.save();
  return res.json({ ok: true, user: result });
};

userController.update = async (req, res, next) => {
  const { id } = req.user;
  console.log(id);
  const user = await User.findByIdAndUpdate(
    id,
    { firstName: "Wes" },
    { new: true }
  );
  return res.json({ ok: true, user });
};

userController.login = async (req, res, next) => {
  return res.json({ ok: true, user: req.user.id });
};

userController.logout = async (req, res, next) => {
  req.logout();
  res.json({ ok: true });
};

userController.me = async (req, res, next) => {
  if (!req.user) {
    return res.json({
      ok: false,
      errors: [{ path: "user", message: "User not logged in." }]
    });
  }

  return res.json({ ok: true, user: req.user.id });
};

module.exports = userController;
