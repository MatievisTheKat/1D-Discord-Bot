const Command = require("../../structures/base/Command");

module.exports = class Knots extends Command {
  constructor() {
    super({
      name: "knots",
      category: "Core",
      description: "View available knots",
      requiresArgs: false,
      guildOnly: false
    });
  }

  async run(msg, args, flags) {
    const embed = new msg.client.embed().none(
      `Do \`${await msg.prefix(
        false
      )}knot {knot_name}\` for more information on a specific knot\n\n${msg.client.config.knots
        .map((k) => `[${k.name.toProperCase()}](${k.link})`)
        .join("\n")}`
    );
    msg.channel.send(embed);
  }
};
