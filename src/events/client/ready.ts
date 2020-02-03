import DBLAPI = require("dblapi.js");
import { CaseEntity, Listener } from "@vortekore/lib";
import WebServer from "../../web/server";

export default class extends Listener {
  public constructor() {
    super("bot-ready", {
      event: "ready",
      emitter: "client"
    });
  }

  async exec(client = this.client) {
    new WebServer(client).init();
    client.user!.setPresence({
      activity: {
        name: "VorteKore | v!help",
        type: "STREAMING",
        url: "https://twitch.tv/vortekore"
      }
    });

    if (process.env.NODE_ENV === "production") {
      const dbl = new DBLAPI(process.env.DBL_TOKEN!, this.client);
      setInterval(() => dbl.postStats(this.client.guilds.size), 120000);
    }

    setInterval(async () => {
      if (!this.client.database.ready) return;
      const cases = await CaseEntity.find({ type: "mute" });
      cases.forEach(async (x: CaseEntity) => {
        if (x.other.muteTime <= Date.now()) {
          try {
            const guild = client.guilds.get(x.guildId);
            if (!guild) return CaseEntity.delete({ id: x.id });

            const _guild = await client.findOrCreateGuild(guild.id);
            if (!_guild.muteRole) return CaseEntity.delete({ id: x.id });

            const member =
              guild.members.get(x.subject) ||
              (await guild.members.fetch(x.subject)) ||
              null;
            if (!member) return CaseEntity.delete({ id: x.id });

            const muteRole = guild.roles.find(r => r.id === _guild.muteRole);
            member.roles.remove(muteRole!).catch(null);

            return CaseEntity.delete({ id: x.id });
          } catch (error) {}
        }
      });
    }, 10000);

    client.logger.info(`${client.user!.username} is ready to rumble!`);
  }
}
