const { Structures, MessageEmbed, Message } = require("discord.js"),
  { xpForLevel, xpUntilNextLevel } = require("../util/util");

class MsgExtension extends Message {
  constructor(...args) {
    super(...args);

    // Initialize cooldowns
    this.cooldown = new Set();
    this.afkCooldown = new Set();
    this.currencyXpCooldown = new Set();
  }

  /**
   * Format a string for success
   * @param {String} [str] The string to format as success
   */
  success(str) {
    return `${this.client.config.msgPrefixes.success} ${str}`;
  }

  /**
   * Format a string for loading
   * @param {String} str The string to format as loading
   */
  loading(str) {
    return `${this.client.config.msgPrefixes.loading} ${str}`;
  }

  /**
   * Format a string for a warning
   * @param {String} str The string to format as a warning
   */
  warning(str) {
    return `${this.client.config.msgPrefixes.warning} ${str}`;
  }

  /**
   * Format a string for an error
   * @param {String} str The string to format as an error
   */
  error(str) {
    return `${this.client.config.msgPrefixes.error} ${str}`;
  }

  /**
   * Get the command properties for this message
   */
  async commandProps() {
    const prefix = await this.prefix(true);

    let [command, ...args] = this.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g);

    const cmd =
      this.client.cmd.commands.get(command.toLowerCase()) ||
      this.client.cmd.commands.get(
        this.client.cmd.aliases.get(command.toLowerCase())
      );

    const flagArgs = args
      .filter((a) => a.startsWith("--"))
      .map((x) => x.slice(2));
    args = args.filter((a) => !a.startsWith("--"));

    const flags = {};
    flagArgs.forEach((flag) => {
      flags[flag] = true;
    });

    return { cmd, args, flags };
  }

  /**
   * Check this message for mentions or an AFK author
   */
  async afkCheck() {
    const authorAfk = await this.client.models.afk.findOne({
      userID: this.author.id
    });

    if (authorAfk !== null && this.guild) {
      await authorAfk.delete();

      if (
        this.member.displayName &&
        this.member.displayName.startsWith("[AFK] ")
      )
        this.member
          .setNickname(this.member.displayName.slice(6))
          .catch(() => {});

      this.channel
        .send(
          this.success(
            `Welcome back ${this.author}! I have removed your AFK status!`
          )
        )
        .then((m) => m.delete({ timeout: 5000 }));
    }

    if (this.mentions.members && this.guild) {
      if (this.afkCooldown.has(this.guild.id)) return;
      this.mentions.members.map(async (mentioned) => {
        const afk = await this.client.models.afk.findOne({
          userID: mentioned.user.id
        });
        if (afk) {
          const startTime = afk.startTime;
          const time = this.client.util.ms(Date.now() - startTime, {
            long: true
          });
          this.channel.send(
            this.warning(
              `**${mentioned.user.username}**#${mentioned.user.discriminator} has been AFK: **${afk.reason}** for ${time}`
            )
          );
        }
      });
      this.afkCooldown.add(this.guild.id);
      setTimeout(() => {
        this.afkCooldown.delete(this.guild.id);
      }, 3000);
    }
  }

  /**
   * Run the message as a command
   */
  async run() {
    if (this.author.bot || this.webhookID) return;

    const prefix = await this.prefix(true);
    if (this.content.toLowerCase().startsWith(prefix)) {
      if (this.cooldown.has(this.guild ? this.guild.id : this.author.id))
        return;

      const { cmd, args, flags } = await this.commandProps();

      if (cmd) {
        try {
          const check = await this.commandCheck(cmd, args, flags);
          if (check !== true) return;

          await cmd.run(this, args, flags);

          const cmdCooldown = this.client.cmd.commandCooldowns.get(
            cmd.help.name
          );
          if (cmdCooldown) {
            cmdCooldown.set(
              cmd.config.guildOnlyCooldown
                ? this.guild
                  ? this.guild.id
                  : this.author.id
                : this.author.id,
              Date.now()
            );
            setTimeout(
              () =>
                cmdCooldown.delete(
                  cmd.config.guildOnlyCooldown
                    ? this.guild
                      ? this.guild.id
                      : this.author.id
                    : this.author.id
                ),
              this.client.util.ms(cmd.config.cooldown)
            );
          }

          this.cooldown.add(this.guild ? this.guild.id : this.author.id);
          setTimeout(
            () =>
              this.cooldown.delete(this.guild ? this.guild.id : this.author.id),
            3000
          );

          return { message: "Successfully ran the command" };
        } catch (err) {
          this.client.logger.error(err);
          return this.client.errors.unknownErr(this);
        }
      }
    } else {
      if (this.content.match(new RegExp(`^<@!?${this.client.user.id}>( |)$`))) {
        this.channel
          .send(
            `Hey there! I am **${
              this.client.user.tag
            }**! To get started just type \`${await this.prefix(false)}help\`!`
          )
          .then((m) => m.delete({ timeout: 20000 }));
      }

      await this.afkCheck();
    }
  }

  /**
   * Get the prefix used for this message
   * @param {Boolean} includeMention Whether to see a mention as a valid prefix
   */
  async prefix(includeMention) {
    const prefixMention = new RegExp(`^<@!?${this.client.user.id}> `);
    const data = await this.client.models.prefix.findOne({
      guildID: this.guild ? this.guild.id : ""
    });

    let prefix = this.client.prefix;
    if (this.content.match(prefixMention) && includeMention)
      prefix = this.content.match(prefixMention)[0];
    else if (data !== null) prefix = data.prefix;

    return prefix;
  }

  /**
   * Run the message through tests to make sure it is valid
   * @param {Object} [cmd] The command to check for
   * @param {Array} [args] Arguments to check for
   * @param {Object} [flags] The flags to check for
   */
  async commandCheck(cmd, args, flags) {
    const cmdCooldown = this.client.cmd.commandCooldowns.get(cmd.help.name);

    if (cmd.config.guildOnly && !this.guild)
      return this.client.errors.guildOnly(this, this.channel);

    if (this.guild) {
      if (
        !this.member.hasPermission(
          cmd.config.requiredPerms ? cmd.config.requiredPerms : "SEND_MESSAGES"
        ) &&
        !this.client.config.creators.ids.includes(this.author.id)
      )
        return this.client.errors.noPerms(
          this,
          this.channel,
          cmd.config.requiredPerms
        );

      if (
        !this.guild.me.hasPermission(
          cmd.config.requiredClientPerms
            ? cmd.config.requiredClientPerms
            : "SEND_MESSAGES"
        )
      )
        return this.client.errors.noClientPerms(
          this,
          this,
          cmd.config.requiredClientPerms
        );
    }

    if (
      cmd.config.creatorOnly &&
      !this.client.config.creators.ids.includes(this.author.id)
    )
      return this.client.errors.creatorOnly(this, this.channel);

    if (
      !this.client.config.creators.ids.includes(this.author.id) &&
      cmdCooldown.has(
        cmd.config.guildOnlyCooldown
          ? this.guild
            ? this.guild.id
            : this.author.id
          : this.author.id
      )
    )
      return this.client.errors.cooldown(
        this,
        this.channel,
        cmdCooldown.get(
          cmd.config.guildOnlyCooldown
            ? this.guild
              ? this.guild.id
              : this.author.id
            : this.author.id
        ),
        cmd.config.cooldown
      );

    if (cmd.config.voiceChannelOnly) {
      if (!this.member.voice || !this.member.voice.channel)
        return this.client.errors.voiceChannelOnly(this, this.channel);

      if (
        !this.guild.me.permissionsIn(this.member.voice.channel).has("CONNECT")
      )
        return await this.client.errors.custom(
          this,
          this.channel,
          "I do not have permisison to connect to that channel! Contact a server admin or move to another voice channel to fix this"
        );

      if (!this.guild.me.permissionsIn(this.member.voice.channel).has("SPEAK"))
        return this.client.errors.custom(
          this,
          this.channel,
          "I do not have permisison to speak in that channel! Contact a server admin or move to another voice channel to fix this"
        );
    }

    if (
      cmd.help.category.toLowerCase() === "music" &&
      this.client.loadMusic !== "true"
    )
      return this.client.errors.custom(
        this,
        this.channel,
        "Music is not currently loaded on the bot! This is usually because it is undergoing updates. Please be patient!"
      );

    if (cmd.config.requiresArgs && !args[0])
      return this.client.errors.noArgs(
        this,
        this.guild,
        this.channel,
        cmd.help.name
      );

    return true;
  }

  /**
   * Convert text to emojis (Not in use)
   * @param {String} str The string to emojify
   */
  emojify(str) {
    return str.toProperCase(); //([...str.replace(/!/gi, this.client.emoji.exclamMark)].map(letter => this.client.emoji[letter.toLowerCase()] || letter).join(""));
  }
}

module.exports = Structures.extend("Message", (Message) => MsgExtension);
