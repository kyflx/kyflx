import DBLAPI from "dblapi.js";
// tslint:disable-next-line: no-implicit-dependencies
import fetch from "node-fetch";
import { Config, Listener } from "../../../lib";
import WebServer from "../../../web/server";

export default class BotReady extends Listener {
  public constructor() {
    super("bot-ready", {
      event: "ready",
      emitter: "client"
    });
  }

  public async exec(client = this.client) {
    const server = new WebServer(client);
    await server.init();

    const activities = [
      `${client.guilds.cache.size.toLocaleString()} guilds!`,
      `${client.commands.modules
        .filter(c => c.categoryID !== "flag")
        .size.toLocaleString()} commands!`,
      `${client.users.cache.size.toLocaleString()} users!`
    ];
    let i = 0;
    setInterval(
      () =>
        client.user.setActivity(
          `VorteKore | ${activities[i++ % activities.length]}`,
          { type: "STREAMING", url: "https://twitch.tv/melike2d" }
        ),
      10000
    );

    if (process.env.NODE_ENV === "production") {
      const dbl = new DBLAPI(Config.get("bot_lists.dbl"), this.client);
      setInterval(async () => {
        await dbl.postStats(this.client.guilds.cache.size);
        await fetch(`https://api.botlist.space/v1/bots/${client.user.id}`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "authorization": Config.get("bot_lists.botlist-space")
          },
          body: `{"server_count": ${client.guilds.cache.size}}`
        });
      }, 120000);
    }

    client.logger.info(`${client.user.username} is ready to rumble!`);
  }
}
