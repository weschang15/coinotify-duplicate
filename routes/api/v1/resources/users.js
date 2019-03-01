const user = require("express").Router();
const passport = require("passport");
const ev = require("express-validation");
const { userController } = require("@controllers");
const { catchErrors } = require("@helpers");
const { validateNewUser, validateLogin } = require("@middlewares");

user
  .route("/")
  .post(ev(validateNewUser), catchErrors(userController.create))
  .put(catchErrors(userController.update));

user.post(
  "/login",
  ev(validateLogin),
  passport.authenticate("local"),
  catchErrors(userController.login)
);
user.post("/logout", catchErrors(userController.logout));
user.get("/me", userController.me);

module.exports = user;
