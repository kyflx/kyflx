import { Command } from "@vortekore/lib";
import { Message } from "discord.js";
import { In } from "../../util";
import { developers } from "../..";

export default class extends Command {
  public constructor() {
    super("shuffle", {
      aliases: ["shuffle"],
      userPermissions(message: Message) {
        if (
          developers.includes(message.author.id) ||
          message.member!.hasPermission("ADMINISTRATOR")
        )
          return;
        else if (
          message._guild!.djRole &&
          message.member!.roles.some(r => r.id !== message._guild!.djRole)
        )
          return "DJ";
        return;
      },
      channel: "guild"
    });
  }

  public async exec(message: Message) {
    if (!message.guild.me.voice.channel)
      return message.sem(message.t("cmds:music.no_vc"), {
        type: "error"
      });

    if (!In(message.member!))
      return message.sem(message.t("cmds:music.join"), {
        type: "error"
      });

    if (message.player.radio)
      return message.sem(message.t("cmds:music.rad"), {
        type: "error"
      });
      
    for (let i = message.queue.next.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [message.queue.next[i], message.queue.next[j]] = [
        message.queue.next[j],
        message.queue.next[i]
      ];
    }
    return message.sem(message.t("cmds:music.shuf.res"));
  }
}
