const Command = require("../../structures/base/Command");

module.exports = class Name extends Command {
  constructor() {
    super({
      name: "setpl",
      category: "Patrols",
      description: "Set the patrol leader of a patrol",
      usage: "{user} {patrol_name}",
      examples: ["@MatievisTheKat rhinos", "492708936290402305 springboks"],
      creatorOnly: true
    });
  }

  async run(msg, args, flags) {
    const clan = await msg.client.models.clan.findOne({
      name: args.slice(1).join(" ")
    });
    if (!clan)
      return msg.channel.send(
        msg.warning("There is no patrol with that name!")
      );

    const target = await msg.client.resolve("user", args[0]);
    if (!target) return msg.client.errors.invalidTarget(msg, msg.channel);

    if (clan.leaderID === target.id)
      return msg.channel.send(
        msg.warning("That user is already the leader of that patrol!")
      );

    clan.leaderID = target.id;
    await clan.save();

    msg.channel.send(
      msg.success(
        `${target} is now the PL of the ${args.slice(1).join(" ")} patrol`
      )
    );
  }
};
