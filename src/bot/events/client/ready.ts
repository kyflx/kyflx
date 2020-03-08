import { Listener, ProfileEntity } from "../../../lib";
import DBL from "dblapi.js";
import WebServer from "../../../web/server";

export default class BotReady extends Listener {
  public constructor() {
    super("bot-ready", {
      event: "ready",
      emitter: "client"
    });
  }

  async exec(client = this.client) {
    (this.client as any).guild_manager.onReady();
    const server = new WebServer(client);
    await server.init();

    let activities = [
        `${client.guilds.cache.size.toLocaleString()} guilds!`,
        `${client.commands.modules
          .filter(c => c.categoryID !== "flag")
          .size.toLocaleString()} commands!`,
        `${client.users.cache.size.toLocaleString()} users!`
      ],
      i = 0;
    setInterval(
      () =>
        client.user.setActivity(
          `VorteKore | ${activities[i++ % activities.length]}`,
          { type: "STREAMING", url: "https://twitch.tv/melike2d" }
        ),
      10000
    );

    if (process.env.NODE_ENV === "production") {
      const dbl = new DBL(client.config.get("DBL_TOKEN"), this.client);
      setInterval(() => dbl.postStats(this.client.guilds.cache.size), 120000);
    }

    client.logger.info(`${client.user!.username} is ready to rumble!`);
  }
}
