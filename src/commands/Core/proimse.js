const Command = require("../../structures/base/Command");

module.exports = class Promise extends Command {
  constructor() {
    super({
      name: "promise",
      category: "Core",
      description: "View the Scout promise",
      requiresArgs: false,
      guildOnly: false
    });
  }

  async run(msg, args, flags) {
    const embed = new msg.client.embed().setDescription(
      msg.client.config.promise
    );
    msg.channel.send(embed);
  }
};
