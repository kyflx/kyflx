import { Message } from "discord.js";
import { Command, In } from "../../../lib";

export default class extends Command {
  public constructor() {
    super("leave", {
      aliases: ["leave", "stop"],
      description: t => t("cmds:music.leave.desc"),
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

    await message.player.destroy();
    if (message.guild.me.voice.channel) await message.player.leave();

    return message.sem(message.t("cmds:music.leave.res"));
  }
}
