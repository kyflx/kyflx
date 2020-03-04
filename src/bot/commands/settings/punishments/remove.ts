import { Command } from "../../../../lib";
import { Argument } from "discord-akairo";
import { Message } from "discord.js";

export default class PunishmentsRemove extends Command {
  public constructor() {
    super("punishments-remove", {
      category: "flag",
      args: [
        {
          id: "level",
          prompt: {
            start: (_: Message) => _.t("cmds:conf.puns.del_prompt")
          },
          type: Argument.validate(
            "number",
            (_, p: string) => !!_._guild.warnPunishments[<any>p]
          )
        }
      ]
    });
  }

  public async exec(message: Message, { level }: { level: number }) {
    delete message._guild.warnPunishments[level];
    await message._guild.save();
    return message.sem(message.t("cmds:conf.puns.del", { level }));
  }
}
