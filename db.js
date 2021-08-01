const connectionString = "mongodb+srv://krugs-mate-bot-access:IlVfVoyyOfVJjqql@krugs-mate-bot-cluster.pwmpx.mongodb.net/krugs-mate-bot?retryWrites=true&w=majority"

const mongoose = require('mongoose')
const eventSchema = require('./schemas/event.js')
const Event = mongoose.model('event', eventSchema, 'events')

const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })

async function createEvent(date) {
  return new Event({
    date,
    created: Date.now()
  }).save()
}

async function findEvent(date) {
  return await Event.findOne({ date })
}

async function createNextEvent(date) {

  let event = await connector.then(async () => {
    return findEvent(date)
  })

  if (!event) {
    event = await createEvent(date)
  }

  return(event)
}

module.exports = {
  createNextEvent
};