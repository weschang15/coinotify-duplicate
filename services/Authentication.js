const { User } = require("@models");

class Authentication {
  static async login({ email, password, req }) {
    const { session } = req;
    if (!session) throw new Error("Session does not exist");

    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid email or password.");

    const validPassword = await user.validatePassword({ password });
    if (!validPassword) throw new Error("Invalid email or password.");

    session.user = user.id;

    return user;
  }

  static async logout({ req }) {
    const { session, user } = req;
    if (!session || !user) throw new Error("Already logged out");

    session.destroy(err => {
      if (err) throw err;
    });

    return true;
  }

  static async me({ req }) {
    const { user } = req;
    if (!user) throw new Error("Unauthorized user.");

    return user;
  }
}

module.exports = Authentication;
