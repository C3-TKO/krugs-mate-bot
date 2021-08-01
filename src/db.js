const connectionString = process.env.MONGO_DB_CONNECTION_STRING

const

const mongoose = require("mongoose");
const eventSchema = require("./schemas/event.js");
const formatDate = require("./utils/formatDate");
const Event = mongoose.model("event", eventSchema, "events");

const connector = mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createEvent(date) {
  return new Event({
    date,
    created: Date.now(),
  }).save();
}

async function findEvent(date) {
  return await Event.findOne({ date });
}

async function createNextEvent(date) {
  let event = await connector.then(async () => {
    return findEvent(date);
  });

  if (!event) {
    event = await createEvent(date);
  }

  return event;
}

async function findNextEvent() {
  const today = new Date()
  return await Event.findOne({ date: {$gte: new Date(formatDate(today))} }).sort({date: 1});
}

module.exports = {
  createNextEvent,
  findNextEvent
};
