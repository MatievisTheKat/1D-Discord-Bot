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
  firstAid: [
    { title: "first degree burn", link: "" },
    { title: "second degree burn", link: "" },
    { title: "third degree burn", link: "" },
    { title: "hyperthermia", link: "" },
    { title: "hypothermia", link: "" },
    { title: "dehydration", link: "" },
    { title: "sunstroke", link: "" },
    { title: "cardiac arrest", link: "" },
    { title: "choking", link: "" },
    { title: "fracture", link: "" },
    { title: "sprain", link: "" },
    { title: "poison", link: "" }
  ],
  knots: [
    { name: "bowline", link: "https://youtu.be/YXRnPES0Qec" },
    { name: "sheepshank", link: "https://youtu.be/lopGPwY-sno" },
    { name: "figure of eight", link: "https://youtu.be/EtzeIQjcKEs" },
    { name: "sheet bend", link: "https://youtu.be/vsj7riFkulE" },
    { name: "carrick bend", link: "https://youtu.be/GJdJKuQJuYE" },
    { name: "reef knot", link: "https://youtu.be/0Y_iorha2k4" },
    {
      name: "round turn and two half hitches",
      link: "https://youtu.be/FqxESYQWTdQ"
    },
    { name: "clove hitch", link: "https://youtu.be/pwdZTHu5rTI" },
    { name: "timber hitch", link: "https://youtu.be/WsCU86SDfb4" }
  ],
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
