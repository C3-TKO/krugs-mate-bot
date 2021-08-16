const formatDate = require("../utils/formatDate");
const { createNextEvent } = require("../db");

module.exports = {
  name: "create",
  description: "Erstellt ein neues Krug Event und räumt alle vergangenen Events in Arachne wieder auf",
  execute(message, args) {
    if (!args.length) {
      const today = new Date();

      return message.reply(
        "Du hast mir nicht ein Datum im Format YYYY-MM-DD gegeben! Versuche es bitte wie folgt:\n```!create " +
          formatDate(today) +
          "```"
      );
    }

    (async () => {
      try {
        const nextEvent = await createNextEvent(args.shift());
        const nextEventDate = new Date(nextEvent.date);
        message.reply(
          `ich habe ein neues Krugs am ${nextEventDate.toDateString()} erstellt.`
        );
      } catch (error) {
        message.reply(`Konnte kein Krug in Arachne anlegen - Grund: ${error}`);
      }
    })();
  },
};
