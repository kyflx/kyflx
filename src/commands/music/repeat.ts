import { Command } from "@vortekore/lib";
import { Message } from "discord.js";
import { In } from "../../util";

export default class extends Command {
  public constructor() {
    super("repeat", {
      aliases: ["repeat", "loop"],
      description: t => t("cmds:music.loop.desc"),
      args: [
        {
          id: "type",
          type: ["queue", ["song", "track"]],
          default: "track"
        }
      ],
      channel: "guild"
    });
  }

  public async exec(message: Message, { type }: { type: "queue" | "track" }) {
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

    //@ts-ignore
    const val = (message.queue.repeat[type] = !message.queue.repeat[type]);
    return message.sem(message.t("cmds:music.loop.res", { val, type }));
  }
}
