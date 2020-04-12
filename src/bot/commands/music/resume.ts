import { Message } from "discord.js";
import { Command, In } from "../../../lib";

export default class extends Command {
  public constructor() {
    super("resume", {
      aliases: ["resume"],
      description: t => t("cmds:music.res.desc"),
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

    if (!message.player.paused)
      return message.sem(message.t("cmds:music.res.alr"));

    await message.player.setPaused(false);
    return message.sem(message.t("cmds:music.res.res"));
  }
}
