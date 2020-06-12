const emoji = require("./constants/emoji");

module.exports = {
  msgPrefixes: {
    error: `${emoji.x_} **|**`,
    success: `${emoji.check} **|**`,
    warning: `${emoji.idle} **|**`,
    loading: `${emoji.generating} **|**`
  },
  nodes: [
    {
      host: "vps.matievisthekat.dev",
      port: 2335,
      password: "youshallnotpass"
    }
  ],
  creators: {
    tags: ["MatievisTheKat#4975", "guppie#7526"],
    ids: ["492708936290402305", "589401749933129738"]
  }
};
