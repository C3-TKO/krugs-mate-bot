const { MessageAttachment } = require("discord.js");

module.exports = {
  name: "rip",
  description: "Displays a picture",
  execute(message, args) {
    // Create the attachment using MessageAttachment
    const attachment = new MessageAttachment("https://i.imgur.com/w3duR07.png");
    // Send the attachment in the message channel
    message.channel.send(attachment);
  },
};
