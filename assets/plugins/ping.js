const { fromBuffer, mimeTypes } = require("file-type");
const { command, isPrivate } = require("../../lib/");
command(
  {
    pattern: "ping",
    react: "⏳️",
    fromMe: isPrivate,
    desc: "To check ping",
    type: "user",
  },
  async (message, match) => {
    const start = new Date().getTime();
    await message.sendMessage(message.jid, "```King haki pinging!```");
    const end = new Date().getTime();
    return await message.sendMessage(
      message.jid,
      "*Pong!*\n ```" + (end - start) + "``` *ms*"
    );
  }
);

