require("module-alias/register");
require("dotenv").config({ path: ".env" });
require("@config/mongoose");
const { agenda } = require("@worker");
const { JOB_TYPES } = process.env;

const types = JOB_TYPES ? JOB_TYPES.split(",") : [];

types.forEach(type => {
  require(`./jobs/${type}`)(agenda);
});

if (types.length) {
  agenda.on("ready", () => {
    agenda.start();
  });
}
