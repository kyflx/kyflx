import { Message } from "discord.js";
import { Command, CommandOptions } from "klasa";
import { Init } from "../../../lib";
import { stripIndents } from "common-tags";

@Init<CommandOptions>({ usage: "[command:command]" })
export default class HelpCommand extends Command {
  public async run(message: Message, [command]: [Command]) {
    if (!command) {
      const embed = this.client
        .embed(message)
        .setDescription(message.t("description"));

      const fn = (id: string) => (c: Command) => c.category === id;
      new Set([...this.store.map((c) => c.category)]).forEach((id) =>
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
          "\u200b", 
          stripIndents`
          • **Category**: ${command.category}
          • **Cooldown**: ${command.cooldown}
          `
        )
  }

  private findDescription(message: Message, command: Command): string {
    return command.description ??
      typeof message.t(`cmds.${command.category}.${command.name}`) === "string"
      ? message.t(`cmds.${command.category}.${command.name}`)
      : message.t(`cmds.${command.category}.${command.name}.desc`);
  }
}
