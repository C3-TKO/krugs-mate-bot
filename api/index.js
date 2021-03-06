require("dotenv").config();
const { prefix } = require("./config.json")
const fs = require("fs");
const Discord = require("discord.js");

function getUserFromMention(mention) {
	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return client.users.cache.get(mention);
	}

  return mention
}

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync("./api/commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


client.on("message", (message) => {
  // Exit and stop if the prefix is not there or if user is a bot
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  const argsWithParsedUserFromMentions = args.map(arg => getUserFromMention(arg))

  if (!client.commands.has(command)) {
    return;
  }

  try {
    client.commands.get(command).execute(message, argsWithParsedUserFromMentions);
  } catch (error) {
    console.error(error);
    message.reply("bei der Ausführung Deines Befehls kame zu einem Fehler! Grund: " + error);
  }
});

client.login(process.env.BOT_TOKEN);
