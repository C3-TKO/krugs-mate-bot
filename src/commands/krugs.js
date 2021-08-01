const columnify = require("columnify");

module.exports = {
  name: "krugs",
  description: "Shows the next krugs with all pairings and available players",
  execute(message, args) {
    const embed = {
      embed: {
        title: "Krugs am 02.08.2021 im Top Tables",
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
              "```\n**Verfügbare Mitspieler:** cgn79, Letssetfire, Unbefugt",
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
              "```",
          },
        ],
      },
    };
    // Send the embed to the same channel as the message
    message.reply(embed);
  },
};