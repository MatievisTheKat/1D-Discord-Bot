const Command = require("../../structures/base/Command");
const axios = require("axios");

module.exports = class ScoutcraftBadges extends Command {
  constructor() {
    super({
      name: "scoutcraftbadges",
      aliases: ["scbs"],
      category: "Core",
      description: "View all available scoutcraft badges",
      cooldown: "10s",
      requiresArgs: false,
      guildOnly: false
    });
  }

  async run(msg, args, flags) {
    const m = await msg.channel.send(msg.loading(`Fetching badges...`));

    const res = await axios.get(
      "https://api.matievisthekat.dev/scouts/badges/scoutcraft"
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
        )}scoutcraftbadge {badge_name}\` for more information\n${badges
          .map((b) => `[${b.name}](${b.link})`)
          .join("\n")}`
      );
      embeds.push(embed);
    }

    await m.delete().catch(() => {});
    msg.client.util.paginate(msg, embeds);
  }
};
