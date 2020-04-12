import { Argument } from "discord-akairo";
import { Message } from "discord.js";
import { Command, DJP, In, VorteEmbed } from "../../../lib";

export default class extends Command {
  public constructor() {
    super("volume", {
      aliases: ["volume", "vol"],
      description: t => t("cmds:music.vol.desc"),
      userPermissions: DJP,
      channel: "guild",
      args: [
        {
          id: "volume",
          type: Argument.range("number", 1, 101),
          otherwise: (_: Message) =>
            new VorteEmbed(_).setDescription(_.t("cmds:music.vol.cur", { _ }))
        }
      ]
    });
  }

  public async exec(message: Message, { volume }: { volume: number }) {
    if (!message.guild.me.voice.channel)
      return message.sem(message.t("cmds:music.no_vc"), {
        type: "error"
      });

    if (!In(message.member))
      return message.sem(message.t("cmds:music.join"), {
        type: "error"
      });

    await message.player.setVolume(volume);
    return message.sem(message.t("cmds:music.vol.res", { volume }));
  }
}
