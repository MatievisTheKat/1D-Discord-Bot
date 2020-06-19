const Command = require("../../structures/base/Command");
const axios = require("axios");

module.exports = class InterestBadge extends Command {
  constructor() {
    super({
      name: "interestbadge",
      aliases: ["ib"],
      category: "Core",
      description: "View a specific interest badge",
      cooldown: "10s",
      requiresArgs: false,
      guildOnly: false,
      requiresArgs: true
    });
  }

  async run(msg, args, flags) {
    const m = await msg.channel.send(msg.loading(`Fetching badge...`));

    const res = await axios.get(
      "https://api.matievisthekat.dev/scouts/badges/interest"
    );
    if (!res.data)
      return msg.chanenl.send(
        msg.warning("Oops! Something went wrong. Try again later")
      );

    const badge = await res.data.data.find((b) =>
      b.name.toLowerCase().includes(args.join(" ").toLowerCase())
    );
    if (!badge)
      return m.edit(msg.warning("There is no interest badge with that name!"));

    const embeds = [];
    const reqs = badge.requirements.join("\n");

    for (let i = 0; i < reqs.length; i += 2000) {
      const part = reqs.substring(i, i + 2000);
      const embed = new msg.client.embed()
        .setThumbnail(badge.img)
        .setTitle(badge.name)
        .setURL(badge.link)
        .setDescription(part);
      embeds.push(embed);
    }

    msg.client.util.paginate(msg, embeds);
  }
};
