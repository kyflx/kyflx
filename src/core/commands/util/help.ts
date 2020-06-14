import { Message } from "discord.js";
import { Command, CommandOptions } from "klasa";
import { Init } from "../../../lib";

@Init<CommandOptions>({ usage: "[command:command]" })
export default class HelpCommand extends Command {
  public async run(message: Message, [ command ]: [ Command ]) {
    if (!command) {
      const embed = this.client
        .embed(message)
        .setDescription(message.t("description"));

      const fn = (id: string) => (c: Command) => c.category === id;
      new Set([
        ...this.store.map((c) => c.category).filter(this.filter(message)),
      ]).forEach((id) =>
        embed.addField(
          `• ${id.capitalize()} (${this.store.filter(fn(id)).size})`,
          this.store
            .filter(fn(id))
            .map((c) => `\`${c.name}\``)
            .join(", ")
        )
      );

      return message.send(embed);
    }

    const rgx = /:[\w.?]+/gi,
      embed = this.client
        .embed(message)
        .setAuthor(`${command.name} ${command.usageString.replace(rgx, "")}`)
        .setDescription(this.findDescription(message, command))
        .addField(
          "**•** Help",
          [
            `• **Category**: ${command.category}`,
            `• **Cooldown**: ${command.cooldown} seconds`,
          ].join("\n")
        );

    if (command.extendedHelp)
      embed.addField(
        "\u200b",
        typeof command.extendedHelp === "function"
          ? command
            .extendedHelp(message.language)
            .includes("COMMAND_HELP_NO_EXTENDED")
          ? message.t("util.help.extended")
          : command.extendedHelp(message.language)
          : command.extendedHelp
      );

    return message.send(embed);
  }

  private filter(message: Message) {
    return (category: string) =>
      ![
        ...(this.client.owners.has(message.author)
          ? []
          : message.member.hasPermission("MANAGE_GUILD")
            ? [ "owner" ]
            : [ "staff", "settings", "owner" ]),
      ].includes(category);
  }

  private findDescription(message: Message, command: Command): string {
    const data = message.language.language;
    return command.description
      ? typeof command.description === "function"
        ? command.description(message.language)
        : command.description
      : typeof data[command.category][command.name] === "string"
        ? data[command.category][command.name]
        : data[command.category][command.name].desc;
  }
}
