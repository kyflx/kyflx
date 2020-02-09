import { Command, equalsIgnoreCase } from "@vortekore/lib";
import { Message } from "discord.js";
import { Argument } from "discord-akairo";

export default class extends Command {
  public constructor() {
    super("prefix", {
      aliases: ["prefix", "prefixes"],
      description: t => t("cmds:conf.prf.desc"),
      channel: "guild",
      userPermissions: ["MANAGE_GUILD"],
      *args(_: Message) {
        const action = yield {
          type: [
            ["add", "new"],
            ["remove", "delete", "rm"]
          ]
        };

        const prefix = yield action
          ? {
              type: Argument.range("string", 1, 5),
              prompt: {
                start: _.t("cmds:conf.prf.start"),
                retry: _.t("cmds:conf.prf.retry")
              }
            }
          : {};

        return { action, prefix };
      }
    });
  }

  public async exec(
    message: Message,
    { action, prefix }: { action: "remove" | "add"; prefix: string }
  ) {
    if (!(action && prefix)) {
      return message.sem(message.t("cmds:conf.prf.curr", { message }));
    }

    const guild = message._guild;
    switch (action) {
      case "add":
        if (guild.prefixes.some(s => equalsIgnoreCase(s, prefix)))
          return message.sem(message.t("cmds:conf.prf.exists"), {
            type: "error"
          });

        if (guild.prefixes.length >= 5)
          return message.sem(message.t("cmds:conf.prf.5prf"), {
            type: "error"
          });

        if (prefix.length > 5)
          return message.sem(message.t("cmds:conf.prf.5ch"), {
            type: "error"
          });

        guild.prefixes.push(prefix);
        await guild.save();
        return message.sem(message.t("cmds:conf.prf.added", { prefix }));
      case "remove":
        if (!guild.prefixes.some(s => equalsIgnoreCase(s, prefix)))
          return message.sem(message.t("cmds:conf.prf.!exists"), {
            type: "error"
          });

        const index = guild.prefixes.findIndex(s =>
          equalsIgnoreCase(s, prefix)
        );
        guild.prefixes.splice(index, 1);

        await guild.save();
        return message.sem(message.t("cmds:conf.prf.rmed", { guild, prefix }));
    }
  }
}
