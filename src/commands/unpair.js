const { findNextEvent, addPlayerToSlot } = require("../db");
const _ = require("lodash");

module.exports = {
  name: "unpair",
  description:
    "Storniert ein verabredetes Spiel von Dir in einem Slot im nächsten Krug",
  execute(message, args) {
    // Argument parsing
    if (!args.length) {
      return message.reply(
        "Du musst mir angeben in welchem Slot Du Dein Match stornieren möchtest. Versuche es bitte wie folgt:\n```!unpair early```"
      );
    }

    if (args[0] !== "early" && args[0] !== "late") {
      return message.reply(
        "Du musst mir angeben in welchem Slot Du Dein Match stornieren möchtest. Versuche es bitte wie folgt:\n```!unpair early```"
      );
    }

    (async () => {
      try {
        const slot = args[0];
        const nextEvent = await findNextEvent();
        const nextEventDate = new Date(nextEvent.date);
        const authorUsername = message.author.username;

        // Checking if there is a match for author in slot
        const indexAuthorMatch = _.findIndex(
          nextEvent.slots[slot].matches,
          function (match) {
            return (
              match.usernameA === authorUsername ||
              match.usernameB === authorUsername
            );
          }
        );

        if (indexAuthorMatch === -1) {
          return message.reply(
            `Du hast im Slot (${slot}) kein Match, dass Du stornieren könntest!`
          );
        }

        const usernameOpponent =
          nextEvent.slots[slot].matches[indexAuthorMatch].usernameA === authorUsername
            ? nextEvent.slots[slot].matches[indexAuthorMatch].usernameB
            : nextEvent.slots[slot].matches[indexAuthorMatch].usernameA;

        // Add both players to available list
        addPlayerToSlot(nextEvent._id, slot, nextEvent.slots[slot].matches[indexAuthorMatch].usernameA)
        addPlayerToSlot(nextEvent._id, slot, nextEvent.slots[slot].matches[indexAuthorMatch].usernameB)
        
        // // Remove match
        nextEvent.slots[slot].matches.splice(indexAuthorMatch, 1);
        nextEvent.save();

        return message.reply(
          `ich habe Dein Match mit ${usernameOpponent} am ${nextEventDate.toDateString()} in Slot (${slot}) storniert.`
        );
        
      } catch (error) {
        message.reply(
          `ich konnte Dein Match mit ${usernameOpponent} in Slot (${slot}) am ${nextEventDate.toDateString()} nicht absagen - Grund: ${error}`
        );
      }
    })();
  },
};
