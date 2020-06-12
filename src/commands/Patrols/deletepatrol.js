const Command = require("../../structures/base/Command");

module.exports = class DeleteClan extends Command {
  constructor() {
    super({
      name: "deletepatrol",
      category: "Patrol",
      description: "Delete a patrol",
      usage: "{patrol_name}",
      examples: ["springboks"],
      creatorOnly: true
    });
  }

  async run(msg, args, flags) {
    const clan = await msg.client.models.clan.findOne({
      name: args.join(" ")
    });
    if (!clan)
      return msg.channel.send(
        msg.warning("There is not patrol with that name!")
      );

    await clan.delete();

    msg.channel.send(msg.success(`I have deleted the **${name}** patrol`));
  }
};
