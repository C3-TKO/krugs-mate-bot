module.exports = {
  name: "slot",
  description:
    "Registers you for one or both slots of the next krugs as available player",
  execute(message, args) {
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
  },
};
