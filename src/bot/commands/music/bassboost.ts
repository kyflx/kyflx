import { Message } from "discord.js";
import { ArrToBands, BassLevels, Command, DJP, In } from "../../../lib";

const levels = ["earrape", "extreme", "hard", "soft", "off"];
export default class extends Command {
  public constructor() {
    super("bassboost", {
      aliases: ["bassboost", "bb", "bass"],
      description: t => t("cmds:music.bb.desc"),
      userPermissions: DJP,
      channel: "guild",
      args: [
        {
          id: "level",
          type: levels
        }
      ]
    });
  }

  public async exec(message: Message, { level }: { level: BassLevels }) {
    if (!message.guild.me.voice.channel)
      return message.sem(message.t("cmds:music.no_vc"), { type: "error" });

    if (!In(message.member))
      return message.sem(message.t("cmds:music.join"), {
        type: "error"
      });

    if (!level)
      return message.sem(
        message.t("cmds:music.bb.curr", {
          current: message.player.bass || "none"
        })
      );

    const set = (...bands: Array<number>) =>
      message.player.setEqualizer.bind(message.player, ArrToBands(bands));
    await when(level, {
      earrape: set(1, 0.75),
      extreme: set(0.75, 0.5),
      hard: set(0.5, 0.25),
      soft: set(0.25, 0.15),
      off: set(0, 0)
    });

    message.player.bass = level;
    return message.sem(message.t("cmds:music.bb.res", { level }));
  }
}
