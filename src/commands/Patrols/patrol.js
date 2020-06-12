const Command = require("../../structures/base/Command");

module.exports = class Clan extends Command {
  constructor() {
    super({
      name: "patrol",
      category: "Patrols",
      description: "View your patrol",
      guildOnlyCooldown: false,
      usage: "<patrol_name>",
      examples: ["rhinos"],
      requiresArgs: false,
      guildOnly: false
    });
  }

  async run(msg, args, flags) {
    const clan = !args[0]
      ? (await msg.client.models.clan.findOne({
          leaderID: msg.author.id
        })) ||
        (await msg.client.models.clan.findOne({
          memberIDs: msg.author.id
        }))
      : await msg.client.models.clan.findOne({
          name: args.join(" "),
        });

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

    return msg.channel.send(embed);
  }
};
