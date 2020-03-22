import { Message } from "discord.js";
import { Command, DJP, In } from "../../../lib";

export default class extends Command {
  public constructor() {
    super("shuffle", {
      aliases: ["shuffle"],
      userPermissions: DJP,
      channel: "guild"
    });
  }

  public async exec(message: Message) {
    if (!message.guild.me.voice.channel)
      return message.sem(message.t("cmds:music.no_vc"), {
        type: "error"
      });

    if (!In(message.member))
      return message.sem(message.t("cmds:music.join"), {
        type: "error"
      });

    for (let i = message.queue.next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [message.queue.next[i], message.queue.next[j]] = [
        message.queue.next[j],
        message.queue.next[i]
      ];
    }
    return message.sem(message.t("cmds:music.shuf.res"));
  }
}
