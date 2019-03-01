const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const http = require("http").Server(app);
const { apollo, sessions } = require("@config");
const api = require("@root/routes/api");
const { winston } = require("@services");
const { currentUser, errorHandler } = require("@middlewares");
const { handlePromiseRejection } = require("@helpers");

// Set application port
app.set("port", process.env.PORT || 4000);
// Configure application security
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: false }));
// Configure morgan logger
app.use(morgan("combined", { stream: winston.stream }));
handlePromiseRejection();

// Takes the raw requests and turns them into usable properties on req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Create a session for each visitor to track logged in users from request to request
app.use(sessions.init());

// Configure api routes
app.use("/api", api);

app.use("/graphql", currentUser);

// Configure application to use custom middleware
app.use(errorHandler);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  const path = require("path");
  app.get("*", (_, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

apollo.init(app, http);

module.exports = { app, http };
