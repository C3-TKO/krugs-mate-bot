const { findNextEvent, addPlayerToSlot } = require("../db");

module.exports = {
  name: "slot",
  description:
    "Registers you for one or both slots of the next krugs as available player",
  execute(message, args) {
    (async () => {
      const nextEvent = await findNextEvent();
      const { username } = message.author;

      const filter = (reaction, user) => {
        return (
          ["1️⃣", "2️⃣", "3️⃣"].includes(reaction.emoji.name) &&
          user.id === message.author.id
        );
      };

      try {
        message
          .reply(
            "wähle bitte aus den folgenden Optionen\n\n1️⃣ = früher Slot\n\n2️⃣  = später Slot\n\n3️⃣ = beide Slots"
          )
          .then(function (message) {
            message
              .react("1️⃣")
              .then(() => message.react("2️⃣"))
              .then(() => message.react("3️⃣"))
              .then(() =>
                message
                  .awaitReactions(filter, {
                    max: 1,
                    time: 60000,
                    errors: ["time"],
                  })
                  .then((collected) => {
                    const reaction = collected.first();

                    if (reaction.emoji.name === "1️⃣") {
                      addPlayerToSlot(nextEvent._id, 'early', username)
                      message.reply(
                        `Du wurdest für den frühen Slot am ${nextEvent.date.toDateString()} eingetragen.`
                      );
                    }
                    if (reaction.emoji.name === "2️⃣") {
                      addPlayerToSlot(nextEvent._id, 'late', username)
                      message.reply(
                        `Du wurdest für den späten Slot am ${nextEvent.date.toDateString()} eingetragen.`
                      );
                    }
                    if (reaction.emoji.name === "3️⃣") {
                      addPlayerToSlot(nextEvent._id, 'early', username)
                      addPlayerToSlot(nextEvent._id, 'late', username)
                      message.reply(
                        `Du wurdest für beide Slots am ${nextEvent.date.toDateString()} eingetragen.`
                      );
                    }
                  })
                  .catch((collected) => {
                    message.reply(
                      `Du wurdest für keinen der beiden Slots am ${nextEvent.date.toDateString()} eingetragen. Zur Erinnerung: Du hast 1 Minute Zeit um Dich zu entscheiden und um auf die Optionen 1️⃣, 2️⃣  oder 3️⃣ zu reagieren.`
                    );
                  })
              );
          });
      } catch (error) {
        message.reply;
      }
    })();
  },
};
