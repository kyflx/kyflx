import { Listener } from "@vortekore/lib";
import { Message } from "discord.js";

export default class extends Listener {
  private coins = (max: number, min: number): number =>
    Math.floor(Math.random() * max) + min;
  private xp = (max: number, min: number): number =>
    Math.floor(Math.random() * max) + min;
  private recently = new Set();
  public constructor() {
    super("message-received", {
      event: "message",
      emitter: "client"
    });
  }

  async exec(message: Message) {
    if (message.guild) {
      const profile = await this.client.findOrCreateProfile(message.author.id, message.guild.id)
      if (!this.recently.has(message.author.id)) {
        if (Math.random() > 0.5) {
          profile.add("coins", this.coins(50, 5));
          if (Math.random() > 0.6) {
            profile.add("xp", this.xp(25, 2));
            if (profile.xp > 2 * (75 * profile.level)) {
              profile.add("level", 1);
              try { 
                if (message._guild && !message._guild!.levelUpMsg)
                  message.sem(
                    `Congrats 🎉! You're now level ${profile.level}`
                  );
              } catch (e) { }
            }
          }
          profile.save();
          this.recently.add(message.author.id);
          setTimeout(() => this.recently.delete(message.author.id), 25000);
        }
      }
    }
  }
}
