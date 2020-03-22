import { Message } from "discord.js";
import { stats } from "../../..";
import { Listener, VorteEmbed } from "../../../lib";

export default class MessageReceivedListener extends Listener {
  private readonly recently = new Set();

  public constructor() {
    super("message-received", {
      event: "message",
      emitter: "client"
    });
  }

  public async exec(message: Message) {
    stats.messages.inc();

    if (message.guild && !message.author.bot) {
      const profile = await this.client.ensureProfile(
        message.author.id,
        message.guild.id
      );
      if (!this.recently.has(message.author.id) && Math.random() > 0.5) {
        profile.add("coins", this.coins(50, 5));
        if (Math.random() > 0.6) {
          profile.add("xp", this.xp(25, 2));
          if (profile.xp > profile.level * 72 * 2) {
            profile.add("level", 1);
            try {
              if (!message._guild.lvlUpMsg) return;
              if (!message._guild.channels.lvlUp)
                return message.sem(
                  message.t("evts:lvl_up", { level: profile.level })
                );

              const channel = message.guild.channels.resolve(
                message._guild.channels.lvlUp
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
            } catch (e) {
              this.logger.error(e);
            }
          }
        }
        await profile.save();
        this.recently.add(message.author.id);
        setTimeout(() => this.recently.delete(message.author.id), 25000);
      }
    }
  }

  private readonly coins = (max: number, min: number): number =>
    Math.floor(Math.random() * max) + min

  private readonly xp = (max: number, min: number): number =>
    Math.floor(Math.random() * max) + min
}
