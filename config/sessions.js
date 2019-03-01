const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
const store = new MongoStore({ mongooseConnection: mongoose.connection });
const { SESSION_KEY, SESSION_SECRET } = process.env;

module.exports = {
  init: () =>
    session({
      secret: SESSION_SECRET,
      key: SESSION_KEY,
      resave: false,
      saveUninitialized: false,
      store,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: false
      }
    })
};
