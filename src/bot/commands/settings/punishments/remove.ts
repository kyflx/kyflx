import { Argument } from "discord-akairo";
import { Message } from "discord.js";
import { Command } from "../../../../lib";

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
            (_, p: string) => !!_._guild.warnPunishments[p as any]
          )
        }
      ]
    });
  }

  public async exec(message: Message, { level }: { level: number }) {
    // tslint:disable-next-line: no-dynamic-delete
    delete message._guild.warnPunishments[level];
    await message.update("warnPunishments", message._guild.warnPunishments);
    return message.sem(message.t("cmds:conf.puns.del", { level }));
  }
}
