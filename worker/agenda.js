const Agenda = require("agenda");

const agenda = new Agenda({
  db: {
    address: process.env.MONGODB_URL,
    collection: "jobs",
    options: { useNewUrlParser: true, useCreateIndex: true }
  },
  maxConcurrency: 50,
  defaultConcurrency: 50
});

module.exports = agenda;
