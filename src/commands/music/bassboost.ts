import { Command } from "@vortekore/lib";
import { Message } from "discord.js";
import { developers } from "../..";
import { In } from "../../util";

export default class extends Command {
  public constructor() {
    super("bassboost", {
      aliases: ["bassboost", "bb"],
      userPermissions(message: Message) {
        if (
          developers.includes(message.author.id) ||
          message.member!.hasPermission("ADMINISTRATOR")
        )
          return;
        else if (
          message._guild!.djRole &&
          message.member!.roles.some(r => r.id !== message._guild!.djRole)
        )
          return "DJ";
        return;
      },
      channel: "guild",
      description: {
        content: "Manages the bassboost for the guild.",
        examples: ["!bassboost medium"],
        usage: "<high|medium|low|none>"
      },
      args: [
        {
          id: "level",
          type: [
            ["high", "max", "Over 9000"],
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
      return message.sem("I'm not in a voice channel...", { type: "error" });

    if (!In(message.member!))
      return message.sem("Please join the voice channel I'm in.", {
        type: "error"
      });

    if (!level)
      return message.sem(
        `The current bassboost level is **${(
          message.player.bass || "none"
        ).toLowerCase()}**.`
      );

    let levels: { [key: string]: number } = {
        high: 0.2,
        medium: 0.1,
        low: 0.05,
        none: 0
      },
      i = 0;

    if (levels[level.toLowerCase()] === undefined)
      return message.sem(
        "The avaliable levels are **high**, **medium**, **low**, and **none**."
      );

    await message.player.setEqualizer(
      Array(3)
        .fill(null)
        .map(() => ({ band: i++, gain: levels[level.toLowerCase()] }))
    );
    message.player.bass = level;
    return message.sem(`Set the bassboost to **${level.toLowerCase()}**.`);
  }
}
