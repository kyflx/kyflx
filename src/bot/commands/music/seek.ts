import { Command, In } from "../../../lib";
import { Message } from "discord.js";
import ms = require("ms");

export default class extends Command {
  public constructor() {
    super("seek", {
      aliases: ["seek"],
      description: t => t("cmds:music.seek.desc"),
      channel: "guild",
      args: [
        {
          id: "time",
          prompt: {
            start: (_: Message) => _.t("cmds:music.seek.prompt")
          },
          type: (_, p) => (p ? ms(p) : null)
        }
      ]
    });
  }

  public async exec(message: Message, { time }: { time: number }) {
    if (!message.guild.me.voice.channel)
      return message.sem(message.t("cmds:music.no_vc"), {
        type: "error"
      });

    if (!In(message.member!))
      return message.sem(message.t("cmds:music.join"), {
        type: "error"
      });

    await message.player.seek(time);
    return message.sem(message.t("cmds:music.seek.res"));
  }
}
