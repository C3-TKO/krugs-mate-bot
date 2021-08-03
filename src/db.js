const connectionString = process.env.MONGO_DB_CONNECTION_STRING

const mongoose = require("mongoose");
const eventSchema = require("./schemas/event.js");
const formatDate = require("./utils/formatDate");
const _ = require("lodash");

// mongoose.set('debug', true);


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

async function findEventByDate(date) {
  return await Event.findOne({ date });
}

async function findEventById(id) {
  return await Event.findOne({ _id: id });
}

async function createNextEvent(date) {
  let event = await connector.then(async () => {
    return findEventByDate(date);
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

async function addPlayerToSlot(krugsEventId, slot, username) {
  const krugsEvent = await findEventById(krugsEventId)
  const { availablePlayers } = krugsEvent.slots[slot]
  const indexUsername = _.findIndex(availablePlayers, { 'username': username })

  if (indexUsername !== -1 ) {
    console.log('Player already in slot list')
    return
  };

  krugsEvent.slots[slot].availablePlayers.push({ username })
  await krugsEvent.save()
}

async function removePlayerFromSlot(krugsEventId, slot, username) {
  const krugsEvent = await findEventById(krugsEventId)
  const { availablePlayers } = krugsEvent.slots[slot]

  const indexUsername = _.findIndex(availablePlayers, { 'username': username })

  if (indexUsername === -1 ) {
    console.log('Player not found in slot list')
    return
  };

  krugsEvent.slots[slot].availablePlayers.splice(indexUsername, 1)
  await krugsEvent.save()
}

module.exports = {
  createNextEvent,
  findNextEvent,
  addPlayerToSlot,
  removePlayerFromSlot
};
