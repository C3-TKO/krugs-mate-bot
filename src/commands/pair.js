const { findNextEvent } = require("../db");
const _ = require("lodash");

module.exports = {
  name: "pair",
  description: "Trägt Dich und eine getaggte MitspielerIn aus der Liste der verfügbaren SpielerInnen für ein verabredetes Spiel in einem Slot im nächsten Krug ein",
  execute(message, args) {
    // Argument parsing
    if (!args.length) {
      return message.reply(
        "Du musst mir angeben in welchem Slot Du Dein Match haben möchtest. MitspielerInnen müssen getagged sein! Versuche es bitte wie folgt:\n```!pair early @Kumachan```"
      );
    }

    if (args[0] !== 'early' && args[0] !== 'late') {
      return message.reply(
        "Du musst mir angeben in welchem Slot Du Dein Match haben möchtest. Versuche es bitte wie folgt:\n```!pair early @Kumachan```"
      );
    }

    if(!args[1]) {
      return message.reply(
        "Du musst eine MitspielerIn taggen. Versuche es bitte wie folgt:\n```!pair early @Kumachan```"
      );
    }

    const user = args[1]
    if(!user?.username) {
      return message.reply(
        "Du musst eine MitspielerIn taggen. Versuche es bitte wie folgt:\n```!pair early @Kumachan```"
      );
    }
    
    (async () => {
      try {
        const slot = args[0]
        const nextEvent = await findNextEvent();
        const nextEventDate = new Date(nextEvent.date);
        const availablePlayersInSlot = nextEvent.slots[slot].availablePlayers.map(player => player.username);

        const authorUsername = message.author.username;

        // Checking if both players are available
        const indexAuthor = availablePlayersInSlot.indexOf(authorUsername)
        if(indexAuthor === -1) {
          return message.reply(
            "Du bist noch nicht im Slot (" + slot + ") als verfügbar eingetragen. Du kannst Dich mit dem folgenden Befehl als verfügbra eintragen:\n```!slot " + slot + "```"
          );  
        }

        const indexUsername = availablePlayersInSlot.indexOf(user.username)
        if(indexUsername === -1) {
          
          return message.reply(
            user.username + " ist nicht im Slot (" + slot + ") verfügbar. Du kannst aus folgeden SpielerInnen wählen:\n```" + availablePlayersInSlot.filter(playerName => playerName !== authorUsername).join(", ") + "```"
          );  
        }

        // Remove both players from available list
        nextEvent.slots[slot].availablePlayers.splice(_.findIndex(nextEvent.slots[slot].availablePlayers, { 'username': user.username }), 1)
        nextEvent.slots[slot].availablePlayers.splice(_.findIndex(nextEvent.slots[slot].availablePlayers, { 'username': authorUsername }), 1)

        nextEvent.slots[slot].matches.push({ usernameA: authorUsername, usernameB: user.username })
        nextEvent.save()

        message.reply(
          `ich habe Dich und ${user.username} am ${nextEventDate.toDateString()} in Slot (${slot}) als zum Spielen fest verabredet eingetragen.`
        );
      } catch (error) {
        message.reply(`ich konnte Dein Match mit ${user.username} nicht im nächsten Krug vereinbaren - Grund: ${error}`);
      }
    })();
  },
};
