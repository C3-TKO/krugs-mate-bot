const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, "Date of event is required"],
  },
  created: {
    type: Date,
    required: [true, "Created date is required"],
  },
});

module.exports = eventSchema;
