const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { withCatch } = require("@helpers");
const { User } = require("@models");

class Passport {
  static initialize() {
    passport.use(
      new LocalStrategy(
        {
          usernameField: "email",
          passwordField: "password"
        },
        this.localStrategy
      )
    );
    passport.serializeUser(this.serializeUser);
    passport.deserializeUser(this.deserializeUser);
  }

  static async localStrategy(username, password, done) {
    const findUser = async () => {
      const user = await User.findOne({ email: username });
      if (!user) {
        throw new Error("Invalid email or password.");
      }

      const isValid = await user.validatePassword({ password });
      if (!isValid) {
        throw new Error("Invalid email or password.");
      }

      return user;
    };

    const [error, user] = await withCatch(findUser());
    if (error) {
      return done(null, false, { message: error.message });
    }

    return done(null, user);
  }

  static serializeUser(user, done) {
    done(null, user.id);
  }

  static async deserializeUser(id, done) {
    const user = await User.findById(id);
    done(null, user);
  }
}

module.exports = Passport;
