import { Argument } from "discord-akairo";
import { Message } from "discord.js";
import { Command } from "../../../../lib";

export default class extends Command {
  public constructor() {
    super("prefix-add", {
      args: [
        {
          id: "prefix",
          type: Argument.range("string", 1, 5),
          prompt: {
            start: (_: Message) => _.t("cmds:conf.prf.start"),
            retry: (_: Message) => _.t("cmds:conf.prf.retry")
          }
        }
      ],
      category: "flag"
    });
  }

  public async exec(message: Message, { prefix }: { prefix: string }) {
    if (message._guild.prefixes.some(s => s.ignoreCase(prefix)))
      return message.sem(message.t("cmds:conf.prf.exists"), {
        type: "error"
      });

    if (message._guild.prefixes.length >= 5)
      return message.sem(message.t("cmds:conf.prf.5prf"), {
        type: "error"
      });

    if (prefix.length > 5)
      return message.sem(message.t("cmds:conf.prf.5ch"), {
        type: "error"
      });

    message._guild.prefixes.push(prefix);
    await this.updateDb(message.guild, "prefixes", message._guild.prefixes);
    return message.sem(message.t("cmds:conf.prf.added", { prefix }));
  }
}
