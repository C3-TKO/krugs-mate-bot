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
    },
    late: {
      availablePlayers: [{ username: String }],
    },
  },
});

module.exports = eventSchema;
