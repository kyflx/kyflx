import { Command } from "@vortekore/lib";
import { ArgumentOptions } from "discord-akairo";
import { Message, TextChannel } from "discord.js";

const channelKeys = ["channel", "memberJoined", "memberLeave"];
export const logs = [
  "warn",
  "editMessage",
  "roleAdd",
  "mute",
  "deleteMessage",
  "kick",
  "purge",
  "roleRemove",
  "ban"
];

export default class extends Command {
  public constructor() {
    super("log", {
      aliases: ["log", "logs"],
      description: t => t("cmds:conf.logs.desc"),
      channel: "guild",
      userPermissions: ["MANAGE_GUILD"],
      *args(_: Message) {
        const action = yield {
          type: ["set", "enable", "disable", "reset"]
        };

        const corlog = yield ((): ArgumentOptions => {
          if (!action || action === "reset") return {};
          return action === "set"
            ? {
                type: "textChannel",
                prompt: {
                  start: _.t("cmds:conf.logs.set_prompt")
                }
              }
            : {
                type: "string",
                match: "rest",
                prompt: {
                  start: _.t("cmds:conf.logs.prompt")
                }
              };
        })();

        return { action, corlog };
      }
    });
  }

  public async exec(
    message: Message,
    {
      action,
      corlog
    }: {
      action: "reset" | "set" | "enable" | "disable";
      corlog: TextChannel | string;
    }
  ) {
    if (!action)
      return message.sem(
        message.t("cmds:conf.logs.curr", { message, channelKeys })
      );

    // const confirmation = await confirm(
    //   message,
    //   `I need confirmation to proceed with the requested action.`
    // );
    // if (!confirmation) return message.sem("Okay, I stopped the request :)");

    switch (action) {
      case "reset":
        Object.keys(message._guild.logs)
          .filter(k => !channelKeys.includes(k))
          // @ts-ignore
          .forEach(key => (message._guild.logs[key] = false));
        message._guild.channels.audit = "";

        message.sem(message.t("cmds:conf.logs.reset"));
        break;
      case "set":
        message._guild.channels.audit = (corlog as TextChannel).id;
        message.sem(message.t("cmds:conf.logs.set", { message, corlog }));
        break;
      case "disable":
      case "enable":
        const filtered = corlog
          .toString()
          .split(",")
          .filter(t => logs.includes(t.trim()))
          .map(t => t.trim());
        if (!filtered.length)
          return message.sem(message.t("cmds:conf.logs.cheif"));
        filtered.forEach(
          // @ts-ignore
          e => (message._guild.logs[e] = action === "disable" ? false : true)
        );
        message.sem(message.t("cmds:conf.logs.de", { filtered, action }));
        break;
    }
    return message._guild.save();
  }
}
