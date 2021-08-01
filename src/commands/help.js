const { prefix } = require("../config.json");

module.exports = {
  name: "help",
  description: "Sendet Dir all für Dich verfügbaren Befehle via DM auf Dein Comlog.",
  execute(message, args) {
    const data = [];
    const { commands } = message.client;

    if (!args.length) {
      data.push("Hier ist eine Liste mit allen Befehlen, die für Dich unterstützt werden:");
      data.push(commands.map((command) => `\`${command.name}\``).join(", "));
      data.push(
        `\nDu kannst mit \`${prefix}help [Befehlsname]\` detaillierte Infos zu einem Befehl bekommen!`
      );

      return message.author
        .send(data, { split: true })
        .then(() => {
          if (message.channel.type === "dm") {
            return;
          } 

          message.reply("Ich habe Dir eine DM mit der Liste aller meiner Befehle auf Dein Comlog geschickt!");
        })
        .catch((error) => {
          console.error(
            `Could not send help DM to ${message.author.tag}.\n`,
            error
          );
          message.reply(
            "ich kann Dir leider keine DMs auf Dein persönliches Comlog schicken, hast Du DMs deaktiviert?"
          );
        });
    }

    const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('das ist kein gültiger Befehl!');
		}

		data.push(`**Name:** ${command.name}`);

		// if (command.aliases) data.push(`**Aliase:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Beschreibung:** ${command.description}`);
		// if (command.usage) data.push(`**Beispiel:** ${prefix}${command.name} ${command.usage}`);

		data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

		message.channel.send(data, { split: true });
  },
};
