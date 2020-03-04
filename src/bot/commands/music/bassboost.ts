import { Message } from "discord.js";
import { BassLevels, In, Command } from "../../../lib";
import { developers } from "../../..";

export default class extends Command {
  public constructor() {
    super("bassboost", {
      aliases: ["bassboost", "bb"],
      description: t => t("cmds:music.bb.desc"),
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
          id: "level",
          type: [
            ["high", "max"],
            ["medium", "mid"],
            ["low", "little"],
            ["none", "0", "nada", "squat"]
          ]
        }
      ]
    });
  }

  public async exec(
    message: Message,
    { level }: { level: "high" | "medium" | "low" | "none" }
  ) {
    if (!message.guild.me.voice.channel)
      return message.sem(message.t("cmds:music.no_vc"), { type: "error" });

    if (!In(message.member!))
      return message.sem(message.t("cmds:music.join"), {
        type: "error"
      });

    if (!level)
      return message.sem(
        message.t("cmds:music.bb.curr", {
          current: message.player.bass || "none"
        })
      );

    let i = 0;
    if (BassLevels[level.toLowerCase()] === undefined)
      return message.sem(message.t("cmds:music.bb.lvls"));

    await message.player.setEqualizer(
      Array(3)
        .fill(null)
        .map(() => ({ band: i++, gain: BassLevels[level.toLowerCase()] }))
    );
    message.player.bass = level;
    return message.sem(message.t("cmds:music.bb.res", { level }));
  }
}
