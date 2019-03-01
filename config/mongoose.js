const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.MONGODB_URL,
  { useNewUrlParser: true, useCreateIndex: true }
);

mongoose.connection.on("error", err => {
  console.error(`🚫 🚫 🚫 → ${err.message}`);
});
