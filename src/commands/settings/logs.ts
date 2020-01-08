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
          "v!logs enable ban warn mute",
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
                type: logs,
                match: "separate",
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
      corlog: TextChannel | string[];
    }
  ) {
    if (!action)
      return message.sem(
        `Logs are sent to ${
          message._guild.logs.channel
            ? `<#${message._guild.logs.channel}> \`(${message._guild.logs.channel})\`.`
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
        message._guild.logs.channel = "";

        message.sem("Successfully reset the log settings!");
        break;
      case "set":
        message._guild.logs.channel = (corlog as TextChannel).id;
        message.sem(
          `Okay, I set the logs channel to ${corlog} \`(${message._guild.logs.channel})\``
        );
        break;
      case "disable":
      case "enable":
        (corlog as string[]).forEach(
          // @ts-ignore
          e => (message._guild.logs[e] = action === "disable" ? false : true)
        );
        message.sem(
          `Okay, I **${action}d** the ${(corlog as string[]).map(e => `**${e}**`).join(", ")} log events.`
        );
        break;
    }
    return message._guild.save();
  }
}
