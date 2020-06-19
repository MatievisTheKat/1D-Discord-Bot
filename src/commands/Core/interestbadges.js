const Command = require("../../structures/base/Command");
const axios = require("axios");

module.exports = class InterestBadges extends Command {
  constructor() {
    super({
      name: "interestbadges",
      aliases: ["ibs"],
      category: "Core",
      description: "View all available interest badges",
      cooldown: "10s",
      requiresArgs: false,
      guildOnly: false
    });
  }

  async run(msg, args, flags) {
    const m = await msg.channel.send(msg.loading(`Fetching badges...`));

    const res = await axios.get(
      "https://api.matievisthekat.dev/scouts/badges/interest"
    );
    if (!res.data)
      return msg.chanenl.send(
        msg.warning("Oops! Something went wrong. Try again later")
      );

    const embeds = [];
    for (let i = 0; i < res.data.data.length; i += 15) {
      const badges = res.data.data.slice(i, i + 15);
      const embed = new msg.client.embed().setDescription(
        `Do \`${await msg.prefix(
          false
        )}interestbadge {badge_name}\` for more information\n${badges
          .map((b) => `[${b.name}](${b.link})`)
          .join("\n")}`
      );
      embeds.push(embed);
    }

    await m.delete().catch(() => {});
    msg.client.util.paginate(msg, embeds);
  }
};
