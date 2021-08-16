const columnify = require("columnify");
const { findNextEvent } = require("../db");

module.exports = {
  name: "krugs",
  description:
    "Zeigt Dir das nächste Krug mit allen Paarungen sowie den Spielern auf der Suche nach Paarungen",
  execute(message, args) {
    (async () => {
      try {
        const nextEvent = await findNextEvent();

        const availablePlayersPerSlot = {
          early: nextEvent.slots.early.availablePlayers.map(
            (availablePlayer) => availablePlayer.username
          ),
          late: nextEvent.slots.late.availablePlayers.map(
            (availablePlayer) => availablePlayer.username
          )
        }

        const titlesPerSlot = {
          early: '**Früher Slot** - 14:00 - 18:00',
          late: '**Später Slot** - 18:00 - 21:00'
        }

        const fields = new Array();
        ['early', 'late'].forEach(slot => {
          fields.push({
            name: titlesPerSlot[slot],
            value: nextEvent.slots[slot].matches.length
              ? "\u200B"
              : "Es sind noch keine Matches in diesem Slot vereinbart!",
          });
  
          nextEvent.slots[slot].matches.forEach((match, index) =>
            fields.push({
              name: `**Tisch #${index + 1}**:`,
              value: [match.usernameA, match.usernameB],
              inline: true,
            })
          );
  
          if (nextEvent.slots[slot].matches.length) {
            fields.push({ name: "\u200B", value: "\u200B" });
          }
  
          fields.push({
            name: "**Verfügbare MitspielerInnen:**",
            value: availablePlayersPerSlot[slot].length
              ? availablePlayersPerSlot[slot].join(", ")
              : "Es gibt zZt. keine weiteren suchenden MitspielerInnen",
          });
  
          fields.push({ name: "\u200B", value: "\u200B" });
        })

        const embed = {
          embed: {
            title: `Krugs am ${nextEvent.date.toDateString()} im Top Tables`,
            url: "https://discordapp.com",
            color: 4811526,
            timestamp: new Date(),
            footer: {
              icon_url: "https://cdn.discordapp.com/embed/avatars/0.png",
              text: "footer text",
            },
            thumbnail: {
              url: "https://cdn.discordapp.com/embed/avatars/0.png",
            },
            author: {
              name: "G3H4",
              url: "https://discordapp.com",
              icon_url: "https://cdn.discordapp.com/embed/avatars/0.png",
            },
            fields,
          },
        };
        message.reply(embed);
      } catch (error) {
        message.reply(`Konnte kein Krug in Arachne finden. Grund: ${error}`);
      }
    })();
  },
};
