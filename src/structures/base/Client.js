const {
    Client,
    Collection,
    Guild,
    GuildMember,
    User,
    Channel,
    Role
  } = require("discord.js"),
  mongoose = require("mongoose"),
  ErrorManager = require("../managers/Error"),
  CommandManager = require("../managers/Command"),
  EventManager = require("../managers/Event"),
  Logger = require("../util/Logger");

const MessageProps = require("../../structures/base/Message");

module.exports = class Bort extends Client {
  constructor(options = {}) {
    super(options);

    // Dunno why these structures don't work without doing this
    this.props = {
      Message: MessageProps
    };

    // Assign properties
    this.token = options.token;
    this.uri = options.uri;
    this.commandDir = options.commandDir;
    this.eventDir = options.eventDir;
    this.prefix = options.prefix;
    this.loadMusic = options.loadMusic;

    // Initialize the snipeMessages collection to hold deleted messages for ~3 seconds
    this.snipeMessages = new Collection();

    // Require constants and utilities
    this.colours = require("../../constants/colours");
    this.emoji = require("../../constants/emoji");
    this.models = require("../../constants/models");
    this.embed = require("./Embed");
    this.util = require("../util/util");
    this.config = require("../../config");

    // Initialize helper classes
    this.logger = new Logger();
    this.errors = new ErrorManager(this);
    this.cmd = new CommandManager(this);
    this.evnt = new EventManager(this);
  }

  /**
   * Remove a set prefix from the database
   * @param {Model} data The model of data for the prefix
   */
  async unloadPrefix(data) {
    if (!data.guildID || !data.prefix || !data)
      throw new Error("Bort#unloadPrefix must have mongodb data");

    await data.delete();

    return true;
  }

  /**
   * Enter a custom prefix for a guild
   * @param {String} guildID The ID of the guild to load a prefix for
   * @param {String} prefix The prefix to set
   */
  async loadPrefix(guildID, prefix) {
    if (!guildID || !prefix)
      throw new Error(
        "Bort#loadPrefix must have a guildID and prefix paramaters"
      );

    const data =
      (await this.models.prefix.findOne({ guildID })) ||
      new this.models.prefix({
        guildID
      });

    data.prefix = prefix;
    await data.save();

    return {
      message: `Successfully loaded the prefix ${prefix} for ${guildID}`,
      status: 200
    };
  }

  /**
   * Resolve for a user, member, channel, role or guild
   * @param {String} type To resolve for a user, guild, channel, role or member
   * @param {String} value The value to search with
   * @param {Guild} guild The guild to search in
   */
  async resolve(type, value, guild) {
    if (!value) return null;
    value = value.toLowerCase();
    switch (type.toLowerCase()) {
      case "member":
        if (!(guild instanceof Guild))
          throw new Error("Must pass the guild parameter");
        if (value instanceof GuildMember) return value;
        const fetchedMember = guild.members.cache.find(
          (m) =>
            m.user.username.toLowerCase().includes(value) ||
            m.user.tag.toLowerCase().includes(value) ||
            m.id === value.replace(/[\\<>@!]/g, "")
        );
        return fetchedMember
          ? (await guild.members.fetch(fetchedMember.id)) || null
          : null;
      case "user":
        if (value instanceof User) return value;
        let fetchedUser = this.users.cache.find(
          (u) =>
            u.username.toLowerCase().includes(value) ||
            u.tag.toLowerCase().includes(value) ||
            u.id === value.replace(/[\\<>@!]/g, "")
        );
        try {
          if (!fetchedUser) fetchedUser = await this.users.fetch(value);
        } catch {}

        return fetchedUser || null;
      case "channel":
        if (!(guild instanceof Guild))
          throw new Error("Must pass the guild parameter");
        if (value instanceof Channel) return value;
        const fetchedChannel = guild.channels.cache.find(
          (c) =>
            c.name.toLowerCase().includes(value) ||
            c.id === value.replace(/[\\<>#]/g, "")
        );
        return fetchedChannel || null;
      case "role":
        if (!(guild instanceof Guild))
          throw new Error("Must pass the guild parameter");
        if (value instanceof Role) return value;
        const fetchedRole = guild.roles.cache.find(
          (r) =>
            r.name.toLowerCase().includes(value) ||
            r.id === value.replace(/[\\<>@&]/g, "")
        );
        return fetchedRole || null;
      default:
        return null;
    }
  }

  /**
   * Reload the client without logging in
   */
  reload() {
    this.logger.warn("Force full reload");

    this.init(false);

    return { message: "Successfully reloaded", status: 200 };
  }

  /**
   * Initialize the client
   * @param {Boolean} login Whether to login when initializing or not
   */
  async init(login = false) {
    this.cmd.load();
    this.evnt.load();
    await this.connect();

    if (login) await this.login(this.token);

    return { message: "Successfully initialized", status: 200 };
  }

  /**
   * Initialize a connection with the MongoDB database
   */
  async connect() {
    await mongoose.connect(this.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    this.logger.log("Connected to database");

    return { message: "Successfully connected to MongoDB", status: 200 };
  }
};
