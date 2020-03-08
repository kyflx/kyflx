import { Command, In } from "../../../lib";
import { Message } from "discord.js";

export default class extends Command {
  public constructor() {
    super("repeat", {
      aliases: ["repeat", "loop"],
      description: t => t("cmds:music.loop.desc"),
      args: [
        {
          id: "type",
          default: "song",
          type: ["queue", ["song", "track"]]
        }
      ],
      channel: "guild"
    });
  }

  public async exec(message: Message, { type }: { type: "queue" | "song" }) {
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

    const val = (message.queue.repeat[type] = !message.queue.repeat[type]);
    return message.sem(message.t("cmds:music.loop.res", { val, type }));
  }
}
