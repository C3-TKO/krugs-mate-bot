require("dotenv").config();
const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync("./src/commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

const columnify = require("columnify");

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

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (!client.commands.has(command)) {
    return;
  }

  try {
    client.commands.get(command).execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("there was an error trying to execute that command!");
  }

  // if (command === "help") {
  //   const commands = columnify(
  //     [
  //       {
  //         command: "!help",
  //         description: "Show this help message listing all possible commands",
  //         example: "",
  //       },
  //       {
  //         command: "!slot",
  //         description:
  //           "Registers you for one or both slots of the next krugs as looking for partner",
  //         example: "",
  //       },
  //       {
  //         command: "!unslot",
  //         description:
  //           "Unregisters you from one or both slots of the next krugs",
  //         example: "",
  //       },
  //       {
  //         command: "!pair @taggedUser",
  //         description:
  //           "Sends an invitation to the tagged user for one or both slots of the next krugs",
  //         example: "!pair @Kumachan 🐻",
  //       },
  //       {
  //         command: "!unpair @taggedUser",
  //         description:
  //           "Unregisters you for one or both slots of the next krugs",
  //         example: "!unpair @Kumachan 🐻",
  //       },
  //       {
  //         command: "!krugs",
  //         description: "Shows the next krugs",
  //         example: "",
  //       },
  //       {
  //         command: "!create",
  //         description: "ADMIN ONLY! Creates a new krugs event",
  //         example: "",
  //       },
  //     ],
  //     {
  //       columnSplitter: "   ",
  //       config: {
  //         command: { minWidth: 20 },
  //         description: { maxWidth: 50 },
  //       },
  //     }
  //   );
  //   message.reply(
  //     "Hi there I am your trusty Krugs Mate bot. What can I do for you?\n\n```" +
  //       commands +
  //       "```"
  //   );
  // }
});

client.login(process.env.BOT_TOKEN);
