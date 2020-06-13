const Command = require("../../structures/base/Command");

module.exports = class Laws extends Command {
  constructor() {
    super({
      name: "law",
      category: "Core",
      description: "View a specific Scout law",
      guildOnly: false
    });
  }

  async run(msg, args, flags) {
    const index = parseInt(args.join(" "));
    if (!index)
      return msg.channel.send(msg.warning("Please supply a valid number"));

    const law = msg.client.config.laws[index - 1];
    if (!law)
      return msg.channel.send(msg.warning(`There is no law number ${index}!`));

    const embed = new msg.client.embed().setDescription(law);
    msg.channel.send(embed);
  }
};
