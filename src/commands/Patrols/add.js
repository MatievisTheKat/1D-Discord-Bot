const Command = require("../../structures/base/Command");

module.exports = class Invite extends Command {
  constructor() {
    super({
      name: "add",
      category: "Patrols",
      description: "Invite a member to a patrol!",
      usage: "{user} {patrol_name}",
      examples: ["@MatievisTheKat rhinos", "394215336846688266 springboks"],
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

    if (clan.memberIDs.includes(target.id))
      return msg.channel.send(
        msg.warning("That user is already in that patrol!")
      );

    clan.memberIDs.push(target.id);
    await clan.save();

    msg.channel.send(
      msg.success(
        `${target} has been added to the ${args.slice(1).join(" ")} patrol`
      )
    );
  }
};
