import { Command } from "@vortekore/lib";
import { Message } from "discord.js";
import { In } from "../../util";

export default class extends Command {
  public constructor() {
    super("seek", {
      aliases: ["seek"],
      description: t => t(""),
      channel: "guild",
      args: [
        {
          id: "time",
          prompt: {
            start: (_: Message) => _.t("cmds:music.seek.prompt")
          },
          type: /(.*)[m|s]/
        }
      ]
    });
  }

  public async exec(message: Message, { time }: { time: { match: number[] } }) {
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

    await message.player.seek(Number(time.match[1]) * 1000);
    return message.sem(message.t("cmds:music.seek.res"));
  }
}
