require("dotenv").config();
const { Client, MessageAttachment } = require("discord.js");
const columnify = require("columnify");
const client = new Client();
const { createNextEvent } = require("./db");

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Set the prefix
const prefix = "!";
client.on("message", (message) => {
  // Exit and stop if the prefix is not there or if user is a bot
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  }

  const args = message.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();

  if (command === "create") {
    if (!args.length) {
      const today = new Date();

      return message.reply(
        "You didn't provide a date argument in format YYYY-MM-DD! Try it like this:\n```!create " +
          formatDate(today) +
          "```"
      );
    }

    (async () => {
      try {
        const nextEvent = await createNextEvent(args.shift());
        const nextEventDate = new Date(nextEvent.date);
        message.reply(
          `Created next krugs event at ${nextEventDate.toDateString()}.`
        );
      } catch (error) {
        message.reply(
          `Failed to create next krugs event. Reason: ${error}`
        );
      }
    })();
  }

  if (command === "args-info") {
    if (!args.length) {
      return message.channel.send(
        `You didn't provide any arguments, ${message.author}!`
      );
    }

    message.channel.send(`Command name: ${command}\nArguments: ${args}`);
  }

  if (command === "help") {
    const commands = columnify(
      [
        {
          command: "!help",
          description: "Show this help message listing all possible commands",
          example: "",
        },
        {
          command: "!slot",
          description:
            "Registers you for one or both slots of the next krugs as looking for partner",
          example: "",
        },
        {
          command: "!unslot",
          description:
            "Unregisters you from one or both slots of the next krugs",
          example: "",
        },
        {
          command: "!pair @taggedUser",
          description:
            "Sends an invitation to the tagged user for one or both slots of the next krugs",
          example: "!pair @Kumachan 🐻",
        },
        {
          command: "!unpair @taggedUser",
          description:
            "Unregisters you for one or both slots of the next krugs",
          example: "!unpair @Kumachan 🐻",
        },
        {
          command: "!krugs",
          description: "Shows the next krugs",
          example: "",
        },
        {
          command: "!create",
          description: "ADMIN ONLY! Creates a new krugs event",
          example: "",
        },
      ],
      {
        columnSplitter: "   ",
        config: {
          command: { minWidth: 20 },
          description: { maxWidth: 50 },
        },
      }
    );
    message.reply(
      "Hi there I am your trusty Krugs Mate bot. What can I do for you?\n\n```" +
        commands +
        "```"
    );
  }

  if (command === "slot") {
    message.react("👍").then(() => message.react("👎"));

    const filter = (reaction, user) => {
      return (
        ["👍", "👎"].includes(reaction.emoji.name) &&
        user.id === message.author.id
      );
    };

    message
      .awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] })
      .then((collected) => {
        const reaction = collected.first();

        if (reaction.emoji.name === "👍") {
          message.reply("you reacted with a thumbs up.");
        } else {
          message.reply("you reacted with a thumbs down.");
        }
      })
      .catch((collected) => {
        message.reply(
          "you reacted with neither a thumbs up, nor a thumbs down."
        );
      });
  }

  if (command === "krugs-demo") {
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
  }

  if (command === "rip") {
    // Create the attachment using MessageAttachment
    const attachment = new MessageAttachment("https://i.imgur.com/w3duR07.png");
    // Send the attachment in the message channel
    message.channel.send(attachment);
  }
});

client.login(process.env.BOT_TOKEN);
