const mongoose = require("mongoose");

const availablePlayerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  created: {
    type: Date,
    required: [true, "Created date is required"],
  },
});

module.exports = availablePlayerSchema;