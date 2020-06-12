const Command = require("../../structures/base/Command");

module.exports = class CreateClan extends Command {
  constructor() {
    super({
      name: "createpatrol",
      category: "Patrols",
      description: "Create a patrol!",
      usage: "{patrol_name}",
      examples: ["springboks"],
      creatorOnly: true
    });
  }

  async run(msg, args, flags) {
    const clanModel = msg.client.models.clan;

    const name = args.join(" ");
    if (await clanModel.findOne({ name }))
      return await msg.client.errors.custom(
        msg,
        msg.channel,
        "There is already a patrol with that name!"
      );

    const clan = new clanModel({
      name,
      leaderID: msg.author.id,
      memberIDs: []
    });
    await clan.save();

    const embed = new msg.client.embed()
      .setAuthor(`Clan: ${clan.name}`)
      .setThumbnail(clan.iconURL)
      .addField(
        "Information",
        `**PL:** <@${clan.leaderID}>\n**APL:** ${
          clan.apl ? `<@${clan.apl}>` : "None"
        }\n**Members:** ${
          clan.memberIDs.map((id) => `<@${id}>`).join("\n") || "[ None ]"
        }`
      );

    msg.channel.send(
      `**New patrol created:**\nUse \`${await msg.prefix(
        false
      )}setpl {user} {patrol_name}\` to set the patrol leader and \`${await msg.prefix(
        false
      )}setapl {user} {patrol_name}\` to set the APL`,
      embed
    );
  }
};
