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
  },
  laws: [
    "A Scout's honour is to be trusted",
    "A Scout is loyal",
    "A Scout's duty is to be useful and help others",
    "A Scout is a friend to all and a brother to every other Scout",
    "A Scout is courteous",
    "A Scout is a friend to animals",
    "A Scout obeys orders",
    "A Scout smiles and whistles under all difficulties",
    "A Scout is thrifty",
    "A Scout is clean in thought, word and deed"
  ],
  promise:
    "On my Honour I promise that I will do my best:\nTo do my duty to God and my country;\nTo help other people at all times;\nTo obey the Scount Law"
};
