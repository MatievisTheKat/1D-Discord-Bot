const { findNested } = require("../util/util"),
  { Collection } = require("discord.js");

module.exports = class EventManager {
  constructor(client) {
    this.dir = client.eventDir;
    this.client = client;

    this.events = new Collection();
  }

  load() {
    const files = findNested(this.dir, ".js");
    for (const file of files) {
      const evnt = new (require(file))();
      if (!evnt.run || !evnt.name) continue;

      this.client.on(evnt.name, evnt.run.bind(null, this.client));

      this.events.set(evnt.name, evnt);
    }

    this.client.logger.log(`Loaded ${files.length} events`);

    return { message: "Successfully loaded events", status: 200 };
  }

  // unloadEvent(evtName) {
  //   this.events.set(evtName, false);
  //   return { message: `Successfully unloaded ${evtName}`, status: 200 };
  // }
};
