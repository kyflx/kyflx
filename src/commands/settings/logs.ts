import { Command, confirm } from "@vortekore/lib";
import { Message, TextChannel } from "discord.js";
import { Argument } from "discord-akairo";
import { ArgumentOptions } from "discord-akairo";

const channelKeys = ["channel", "memberJoined", "memberLeave"];
const logs = [
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
      description: {
        content: "Manages the guild logs.",
        usage: "<action> <[channel|...logEvents]>",
        examples: [
          "v!logs enable ban, warn, mute",
          "v!logs disable purge",
          "v!logs enable purge",
          "v!logs set #logs"
        ]
      },
      channel: "guild",
      userPermissions: ["MANAGE_GUILD"],
      *args() {
        const action = yield {
          type: ["set", "enable", "disable", "reset"]
        };

        const corlog = yield ((): ArgumentOptions => {
          if (!action || action === "reset") return {};
          return action === "set"
            ? {
                type: "textChannel",
                prompt: {
                  start: "Provide a text channel to use as logs."
                }
              }
            : {
                type: "string",
                match: "rest",
                prompt: {
                  start: `Provide some valid log types...\n${logs
                    .map(l => `\`${l}\``)
                    .join(", ")}`
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
        `Logs are sent to ${
          message._guild.channels.audit
            ? `<#${message._guild.channels.audit}> \`(${message._guild.channels.audit})\`.`
            : `the void...`
        }\n **Enabled Events**: ${Object.keys(message._guild.logs)
          // @ts-ignore
          .filter(k => !channelKeys.includes(k) && message._guild.logs[k])
          .map(key => `\`${key}\``)
          .join(", ") || "Wow nothing"}`
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

        message.sem("Successfully reset the log settings!");
        break;
      case "set":
        message._guild.channels.audit = (corlog as TextChannel).id;
        message.sem(
          `Okay, I set the logs channel to ${corlog} \`(${message._guild.channels.audit})\``
        );
        break;
      case "disable":
      case "enable":
        const filtered = corlog
          .toString()
          .split(",")
          .filter(t => logs.includes(t.trim()));
        if (!filtered.length)
          return message.sem("Can't do anything about that chief...");
        filtered.forEach(
          // @ts-ignore
          e => (message._guild.logs[e.trim()] = action === "disable" ? false : true)
        );
        message.sem(
          `Okay, I **${action}d** the ${filtered
            .map(e => `**${e.trim()}**`)
            .join(", ")} log events.`
        );
        break;
    }
    return message._guild.save();
  }
}
