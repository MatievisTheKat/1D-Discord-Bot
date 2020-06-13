const Command = require("../../structures/base/Command");

module.exports = class Laws extends Command {
  constructor() {
    super({
      name: "laws",
      category: "Core",
      description: "View the Scout laws",
      requiresArgs: false,
      guildOnly: false
    });
  }

  async run(msg, args, flags) {
    const embed = new msg.client.embed().setDescription(
      msg.client.config.laws.map((l, i) => `**${i + 1}.** ${l}`).join("\n")
    );
    msg.channel.send(embed);
  }
};
