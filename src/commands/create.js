const formatDate = require("../utils/formatDate");
const { createNextEvent } = require("../db");

module.exports = {
  name: "create",
  description: "Creates a krugs event and deletes all event in past",
  execute(message, args) {
    if (!args.length) {
      const today = new Date();

      return message.reply(
        "you didn't provide a date argument in format YYYY-MM-DD! Try it like this:\n```!create " +
          formatDate(today) +
          "```"
      );
    }

    (async () => {
      try {
        const nextEvent = await createNextEvent(args.shift());
        const nextEventDate = new Date(nextEvent.date);
        message.reply(
          `created next krugs event at ${nextEventDate.toDateString()}.`
        );
      } catch (error) {
        message.reply(`failed to create next krugs event. Reason: ${error}`);
      }
    })();
  },
};
