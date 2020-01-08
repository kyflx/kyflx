import DBLAPI = require("dblapi.js");
import { CaseEntity, Listener } from "@vortekore/lib";
import WebServer from '../../web/server';

export default class extends Listener {
  public constructor() {
    super("bot-ready", {
      event: "ready",
      emitter: "client"
    });
  }

  async exec(bot = this.client) {
    const server = new WebServer(this.client);
    
    await server.init();
    await bot.database.onReady();

    bot.user!.setPresence({
      activity: {
        name: "VorteKore | v!help",
        type: "STREAMING",
        url: "https://api.chaosphoe.xyz/rick"
      }
    });

    if (process.env.NODE_ENV!.ignoreCase("production")) {
      new DBLAPI(process.env.DBL_TOKEN!, this.client);
    }

    setInterval(async () => {
      const cases = await CaseEntity.find({ type: "mute" });
      cases.forEach(async (x: CaseEntity) => {
        if (x.other.muteTime <= Date.now()) {
          try {
            const guild = bot.guilds.get(x.guildId);
            if (!guild) return CaseEntity.delete({ id: x.id });

            const _guild = await bot.findOrCreateGuild(guild.id);
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

    bot.logger.info(`${bot.user!.username} is ready to rumble!`);
  }
}
