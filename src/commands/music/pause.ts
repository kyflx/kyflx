import { Command } from "@vortekore/lib";
import { Message } from "discord.js";
import { In } from "../../util";

export default class extends Command {
  public constructor() {
    super("pause", {
      aliases: ["pause"],
      description: t => t("cmds:music.pause.desc"),
      channel: "guild"
    });
  }

  public async exec(message: Message) {
    if (!message.guild.me.voice.channel)
      return message.sem(message.t("cmds:music.no_vc"), { type: "error" });

    if (!In(message.member))
      return message.sem(message.t("cmds:music.join"), {
        type: "error"
      });

    if (message.player.paused)
      return message.sem(message.t("cmds:music.pause.alr"));

    await message.player.pause();
    return message.sem(message.t("cmds:music.pause.res"));
  }
}
