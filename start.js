require("module-alias/register");
require("dotenv").config({ path: ".env" });
require("@config/mongoose");
require("@models");

// Start our app!
const { app, http } = require("./app");
const server = http.listen(app.get("port"), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
