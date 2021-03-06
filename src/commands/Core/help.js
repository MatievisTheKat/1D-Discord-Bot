const Command = require("../../structures/base/Command");

module.exports = class Help extends Command {
  constructor() {
    super({
      name: "help",
      aliases: ["commands", "cmds"],
      category: "Core",
      description: "Get information and a list of commands for this bot",
      usage: "<command | category>",
      examples: ["post", "Core", "--page"],
      cooldown: "3s",
      flags: ["page"],
      requiresArgs: false
    });
  }

  async run(msg, args, flags) {
    const prefix = await msg.prefix(false);
    let commandSize = msg.client.cmd.commands.filter((c) =>
      c.help.name.toLowerCase() &&
      !msg.client.config.creators.ids.includes(msg.author.id)
        ? !c.config.creatorOnly
        : true && !msg.guild
        ? !c.config.guildOnly
        : true
    ).size;

    class BaseHelpEmbed extends msg.client.embed {
      constructor(options) {
        super(options);

        this.setFooter(
          `Currently running ${commandSize} commands! | < optional > { required } Prefix: ${prefix}`
        ).setThumbnail(msg.client.user.displayAvatarURL({ size: 512 }));
      }
    }

    if (!args[0]) {
      const embeds = [];

      const categories = msg.client.cmd.commands
        .map((c) => c.help.category)
        .reduce((a, b) => {
          if (a.indexOf(b) < 0) a.push(b);
          return a;
        }, [])
        .sort();

      const baseEmbed = new BaseHelpEmbed();

      for (const category of categories) {
        let commands = msg.client.cmd.commands.filter(
          (c) => c.help.category.toLowerCase() === category.toLowerCase()
        );

        commands = commands
          .filter((c) =>
            c.help.name &&
            !msg.client.config.creators.ids.includes(msg.author.id)
              ? !c.config.creatorOnly
              : true && !msg.guild
              ? !c.config.guildOnly
              : true
          )
          .map((c) => `\`${c.help.name}\``);

        if (commands.length < 1) continue;

        const embed = !flags["page"] ? baseEmbed : new BaseHelpEmbed();

        embed.addField(
          msg.client.util.formatCategory(category),
          `${commands.sort().join(", ")}`
        );

        embeds.push(embed);
      }

      flags["page"]
        ? msg.client.util.paginate(msg, embeds)
        : msg.channel.send(embeds[0]);
    } else {
      const embed = new BaseHelpEmbed();

      if (
        msg.client.cmd.commands.get(args.join(" ").toLowerCase()) ||
        msg.client.cmd.commands.get(
          msg.client.cmd.aliases.get(args.join(" ").toLowerCase())
        )
      ) {
        const command =
          msg.client.cmd.commands.get(args.join(" ").toLowerCase()) ||
          msg.client.cmd.commands.get(
            msg.client.cmd.aliases.get(args.join(" ").toLowerCase())
          );

        embed
          .setDescription(
            `${msg.emojify(command.help.name)}\n\`\`\`dust\n${prefix}${
              command.help.name
            } ${command.help.usage || ""}\n\n${command.help.description}\`\`\``
          )
          .addField(
            msg.emojify("user perms"),
            `\`\`\`md\n${
              command.config.requiredPerms
                ? command.config.requiredPerms.map((p) => `+ ${p}\n`)
                : "+ None"
            }\`\`\``,
            true
          )
          .addField(
            msg.emojify("bot perms"),
            `\`\`\`md\n+ SEND_MESSAGES\n${
              command.config.requiredClientPerms
                ? command.config.requiredClientPerms.map((p) => `+ ${p}\n`)
                : "\n"
            }\`\`\``,
            true
          )
          .addField(
            msg.emojify("examples"),
            `\`\`\`dust\n${
              command.help.examples
                ? command.help.examples
                    .map((e) => `${prefix}${command.help.name} ${e}`)
                    .join("\n")
                : "[ None ]"
            }\`\`\``
          )
          .addField(
            msg.emojify("aliases"),
            `\`\`\`md\n[ ${
              command.help.aliases
                ? command.help.aliases.sort().join(", ")
                : "None"
            } ]\`\`\``,
            true
          )
          .addField(
            msg.emojify("flags"),
            `\`\`\`md\n[ ${
              command.help.flags && command.help.flags.length > 0
                ? command.help.flags.sort().join(", ")
                : "None"
            } ]\`\`\``,
            true
          )
          .addField(
            msg.emojify("cooldown"),
            `\`\`\`md\n+ Cooldown: ${
              msg.client.util.ms(msg.client.util.ms(command.config.cooldown), {
                long: true
              }) || "[ None ]"
            }\n+ Cooldown type: ${
              command.config.guildOnlyCooldown ? "Guild" : "User"
            }\`\`\``
          )
          .addField(
            msg.emojify("extra"),
            `\`\`\`md\n+ Guild only: ${
              command.config.guildOnly ? "Yes" : "No"
            }\n+ Creator only: ${
              command.config.creatorOnly ? "Yes" : "No"
            }\n+ Arguments: ${
              command.config.requiresArgs ? "Required" : "Not required"
            }\`\`\``,
            true
          );
      } else {
        embed.setDescription(msg.emojify(args.join(" "))).addField(
          `**Query:** ${args.join(" ")}`,
          msg.client.cmd.commands.filter((c) =>
            c.help.category.toLowerCase().includes(args.join(" ").toLowerCase())
          ).size > 0
            ? `\`\`\`${msg.client.cmd.commands
                .filter((c) =>
                  c.help.category
                    .toLowerCase()
                    .includes(args.join(" ").toLowerCase())
                )
                .map((c) => c.help.name)
                .sort()
                .join(", ")}\`\`\``
            : "No results"
        );
      }
      msg.channel.send(embed);
    }
  }
};
