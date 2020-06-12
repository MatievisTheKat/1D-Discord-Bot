const { Schema, model } = require("mongoose");

const playlist = model(
  "playlists",
  new Schema({
    userID: String,
    name: String,
    tracks: Array
  })
);

module.exports = {
  playlist,
  clan: model(
    "clans",
    new Schema({
      name: String,
      leaderID: String,
      memberIDs: Array,
      apl: String
    })
  ),
  prefix: model(
    "prefixes",
    new Schema({
      guildID: String,
      prefix: String
    })
  ),
  afk: model(
    "afks",
    new Schema({
      userID: String,
      reason: String,
      startTime: String
    })
  ),
  suggestionChannel: model(
    "suggestion_channels",
    new Schema({
      guildID: String,
      channelID: String
    })
  ),
  suggestion: model(
    "suggestions",
    new Schema({
      guildID: String,
      accepted: Boolean,
      denied: Boolean,
      messageID: String
    })
  )
};
