import { Collection, VoiceChannel } from "discord.js";
import DBLAPI = require("dblapi.js");
import { Event, CaseEntity } from "@vortekore/lib";

export default class extends Event {
  public constructor() {
    super("bot-ready", {
      category: "client",
      event: "ready"
    });
  }

  async run(bot = this.bot) {
    await bot.database.onReady();
    await bot.plugins.forEach(plugin => plugin.onReady());
    await bot.logger.info(`${bot.user!.username} is ready to rumble!`);

    bot.user!.setPresence({
      activity: {
        name: "VorteKore | !help",
        type: "STREAMING",
        url: "https://api.chaosphoe.xyz/rick"
      }
    });

    if (process.env.NODE_ENV!.ignoreCase("production")) {
      new DBLAPI(process.env.DBL_TOKEN!, this.bot);
    }

    setInterval(async () => {
      const cases = await CaseEntity.find({ type: "mute" });
      cases.forEach(async (x: CaseEntity) => {
        if (x.amount <= Date.now()) {
          try {
            const guild = bot.guilds.get(x.guildId);
            if (!guild) return CaseEntity.delete({ id: x.id });

            const _guild = await bot.database.getGuild(guild.id);
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
  }
}
