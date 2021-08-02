const columnify = require("columnify");
const { findNextEvent } = require("../db")

module.exports = {
  name: "krugs",
  description: "Zeigt Dir das nächste Krug mit allen Paarungen sowie den Spielern auf der Suche nach Paarungen",
  execute(message, args) {
    (async () => {
      try {
        const nextEvent = await findNextEvent();
        const earlySlotAvailablePlayers = nextEvent.slots.early.availablePlayers.map(availablePlayer => availablePlayer.username);
        const lateSlotAvailablePlayers = nextEvent.slots.late.availablePlayers.map(availablePlayer => availablePlayer.username);
        
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
            fields: [
              {
                name: "**Früher Slot** - 14:00 - 17:30",
                value:
                  "```" +
                  columnify(
                    [
                      {
                        a: "Kumachan",
                        b: "Moxtron",
                        time: "14:00",
                      },
                      {
                        a: "Sense42",
                        b: "The Snow",
                        time: "15:00",
                      },
                    ],
                    {
                      minWidth: 10,
                    }
                  ) +
                  "```\n**Verfügbare Mitspieler:** " + earlySlotAvailablePlayers.join(', '),
              },
              { name: "\u200B", value: "\u200B" },
              {
                name: "**Später Slot** - 18:00 - 21:00",
                value:
                  "```" +
                  columnify(
                    [
                      {
                        a: "Blindside",
                        b: "cgn79",
                        time: "14:00",
                      },
                      {
                        a: "Sense42",
                        b: "The Snow",
                        time: "15:00",
                      },
                      {
                        a: "Quirk",
                        b: "Letssetfire",
                        time: "15:00",
                      },
                      {
                        a: "Cleyment",
                        b: "Lupus",
                        time: "15:00",
                      },
                    ],
                    {
                      minWidth: 10,
                    }
                  ) +
                  "```\n**Verfügbare Mitspieler:** " + lateSlotAvailablePlayers.join(', '),
              },
            ],
          },
        };
        message.reply(embed);
      } catch (error) {
        message.reply(`Konnte kein Krug in Arachne finden. Grund: ${error}`);
      }
    })();
  },
};
