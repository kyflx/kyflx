import { Listener, VorteEmbed } from "../../../lib";
import { Message } from "discord.js";
import { stats } from "../../..";

export default class MessageReceivedListener extends Listener {
  private recently = new Set();

  public constructor() {
    super("message-received", {
      event: "message",
      emitter: "client"
    });
  }

  async exec(message: Message) {
    stats.messages.inc();

    if (message.guild) {
      const profile = await this.client.findOrCreateProfile(
        message.author.id,
        message.guild.id
      );
      if (!this.recently.has(message.author.id)) {
        if (Math.random() > 0.5) {
          profile.add("coins", this.coins(50, 5));
          if (Math.random() > 0.6) {
            profile.add("xp", this.xp(25, 2));
            if (profile.xp > 2 * (75 * profile.level)) {
              profile.add("level", 1);
              try {
                if (!message._guild.lvlUpMsg) return;
                if (!message._guild.lvlUpChannel)
                  return message.sem(
                    message.t("evts:lvl_up", { level: profile.level })
                  );

                const channel = message.guild.channels.resolve(
                  message._guild.lvlUpChannel
                );
                if (!channel)
                  return message.sem(
                    message.t("evts:lvl_up", { level: profile.level })
                  );
                return message.channel.send(
                  new VorteEmbed(message).setDescription(
                    message.t("evts:lvl_up", { level: profile.level })
                  )
                );
              } catch (e) {}
            }
          }
          profile.save();
          this.recently.add(message.author.id);
          setTimeout(() => this.recently.delete(message.author.id), 25000);
        }
      }
    }
  }

  private coins = (max: number, min: number): number =>
    Math.floor(Math.random() * max) + min;

  private xp = (max: number, min: number): number =>
    Math.floor(Math.random() * max) + min;
}
