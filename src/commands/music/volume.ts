import { Command, VorteEmbed } from "@vortekore/lib";
import { Message } from "discord.js";
import { Argument } from "discord-akairo";
import { developers } from "../..";
import { In } from "../../util";

export default class extends Command {
  public constructor() {
    super("volume", {
      aliases: ["volume", "vol"],
      description: t => t("cmds:music.vol.desc"),
      userPermissions(message: Message) {
        if (
          developers.includes(message.author.id) ||
          message.member!.hasPermission("ADMINISTRATOR")
        )
          return;
        else if (
          message._guild!.djRole &&
          message.member!.roles.resolve(message._guild!.djRole)
        )
          return "DJ";
        return;
      },
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

    if (!In(message.member!))
      return message.sem(message.t("cmds:music.join"), {
        type: "error"
      });

    await message.queue.setVolume(volume);
    return message.sem(message.t("cmds:music.vol.res", { volume }));
  }
}
