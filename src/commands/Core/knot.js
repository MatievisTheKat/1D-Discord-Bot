const Command = require("../../structures/base/Command");

module.exports = class Knots extends Command {
  constructor() {
    super({
      name: "knot",
      category: "Core",
      description: "Get a video on how to tie a specific knot",
      guildOnly: false
    });
  }

  async run(msg, args, flags) {
    const knot = msg.client.config.knots.find((k) =>
      k.name.toLowerCase().includes(args.join(" ").toLowerCase())
    );
    if (!knot)
      return msg.channel.send(
        msg.warning(
          `Couldn't find that knot. If you want it added contact ${msg.client.config.creators.tags[0]}`
        )
      );
      
    msg.channel.send(knot.link);
  }
};
