const Command = require("../../structures/base/Command");

module.exports = class Remove extends Command {
  constructor() {
    super({
      name: "remove",
      category: "Patrols",
      description: "Remove a member from your patrol",
      usage: "{user} {patrol_name}",
      examples: ["@MatievisTheKat", "700377722576437370"],
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

    if (!clan.memberIDs.includes(target.id))
      return msg.channel.send(msg.warning("That user is not in the patrol!"));

    clan.memberIDs.splice(clan.memberIDs.indexOf(target.id), 1);
    await clan.save();

    msg.channel.send(
      msg.success(`**${target.username}** has been removed from the patrol`)
    );
  }
};
