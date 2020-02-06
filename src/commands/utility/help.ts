import ms = require("ms");
import { Command, VorteEmbed } from "@vortekore/lib";
import { Message } from "discord.js";

export default class extends Command {
  public constructor() {
    super("help", {
      aliases: ["help", "commands", "halp"],
      description: t => t("cmds:util.help.desc"),
      args: [
        {
          id: "command",
          type: "commandAlias"
        }
      ]
    });
  }

  public async exec(message: Message, { command }: { command: Command }) {
    const helpEmbed = new VorteEmbed(message).baseEmbed();

    if (!command) {
      helpEmbed.setAuthor("All Commands", message.author.displayAvatarURL());
      helpEmbed.setDescription(
        "**Syntax**: <> Required; [] Optional; <[]> Depends on Previous Argument."
      );

      for (const [name, category] of this.client.commands.categories) {
        if (category.size)
          helpEmbed.addField(
            name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
            category.map(c => `\`${c.aliases[0]}\``).join(", "),
            true
          );
      }

      return message.util.send(helpEmbed);
    }

    let info = "";
    const description = typeof command.description === "function"
      ? command.description(message.t.bind(message))
      : {};

    info += `**Category**: ${command.categoryID}\n`;
    info += `**Description**: ${description.content || "None"}\n`;
    info += `**Cooldown**: ${ms(command.cooldown || 5000)}\n`;
    info += `**Aliases**: ${command.aliases.map(a => `\`${a}\``).join(", ") ||
      "None"}\n`;

    helpEmbed.setAuthor(
      `${command.aliases[0]} ${description.usage || ""}`,
      message.author.displayAvatarURL()
    );

    helpEmbed.setDescription(info);

    if (description.examples && description.examples.length > 0)
      helpEmbed.addField(
        "Examples",
        description.examples.map((e: string) => `\`${e}\``).join("\n")
      );

    message.util.send(helpEmbed);
  }
}
