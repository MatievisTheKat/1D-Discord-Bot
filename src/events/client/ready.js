const Event = require("../../structures/base/Event");
const { ErelaClient } = require("erela.js");

module.exports = class Ready extends Event {
  constructor() {
    super("ready");
  }

  async run(client) {
  
    setStatus(client);

    setInterval(() => {
      setStatus(client);
    }, 60 * 60 * 1000);

    if (client.loadMusic === "true") {
      client.music = new ErelaClient(client, client.config.nodes);
      client.music
        .on("nodeConnect", (node) => client.logger.info("Created new node"))
        .on("nodeError", (node, err) =>
          client.logger.error(`Node Error: ${err.stack}`)
        )
        .on(
          "queueEnd",
          async (player) =>
            await client.music.players.destroy(player.voiceChannel.guild.id)
        );
    }

    client.logger.log(
      client.util.chalk.cyan(
        `Logged in as ${client.util.chalk.red(client.user.tag)} with ${
          client.guilds.cache.size
        } guilds`
      )
    );
  }
};

function setStatus(client) {
  client.user.setPresence({
    activity: {
      name: `rhinos is the best patrol`
    }
  });
}
