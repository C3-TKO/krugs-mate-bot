const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  date: {
    type: Date,
    unique: true,
    required: [true, "Date of event is required"],
  },
  created: {
    type: Date,
    required: [true, "Created date is required"],
  },
  slots: {
    early: {
      availablePlayers: [{ username: String }],
      matches: [{ usernameA: String, usernameB: String }],
    },
    late: {
      availablePlayers: [{ username: String }],
      matches: [{ usernameA: String, usernameB: String }],
    },
  },
});

module.exports = eventSchema;
