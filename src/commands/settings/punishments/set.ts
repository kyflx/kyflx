import { Command } from "@vortekore/lib";
import { Argument } from "discord-akairo";
import { Message } from "discord.js";
import ms = require("ms");

export default class PunishmentsRemove extends Command {
  public constructor() {
    super("punishments-set", {
      category: "flag",
      args: [
        {
          id: "level",
          prompt: {
            start: (_: Message) => _.t("cmds:conf.puns.del_prompt")
          },
          type: Argument.validate(
            "number",
            (_, p: string) => true // !!_._guild.warnPunishments[<any>p]
          )
        },
        {
          id: "type",
          type: ["ban", "kick", "mute"]
        },
        {
          id: "duration",
          type: (_: Message, p: string) => p ? ms(p) : null
        }
      ]
    });
  }

  public async exec(
    message: Message,
    {
      level,
      type,
      duration
    }: {
      level: number;
      type: "ban" | "kick" | "mute";
      duration: number;
    }
  ) {
    const data = { type, duration };
    message._guild.warnPunishments[level] = data;
    await message._guild.save();
    return message.sem(message.t("cmds:conf.puns.new", { p: data, level }));
  }
}
