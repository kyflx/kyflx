import ms = require("ms");
import { Command, VorteEmbed } from "@vortekore/lib";
import { Message } from "discord.js";

export default class extends Command {
  public constructor() {
    super("help", {
      aliases: ["help", "commands", "halp"],
      description: {
        content: "Shows all the commands that the bot has to offer",
        usage: "[command]",
        examples: ["v!help", "v!help cat"]
      },
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
      helpEmbed.setDescription("**Syntax**: <> Required; [] Optional; <[]> Depends on Previous Argument.")
      for (const [name, category] of this.client.commands.categories) {
        if (category.size)
          helpEmbed.addField(
            name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
            category.map(c => `\`${c.aliases[0]}\``).join(", "),
            true
          );
      }
    } else {
      let info = "";
      const description = command.description
        ? command.description
        : { usage: "", content: "", examples: [] };
      info += `**Category**: ${command.categoryID}\n`;
      info += `**Description**: ${description.content || "None"}\n`;
      info += `**Cooldown**: ${ms(
        command.cooldown || this.client.commands.defaultCooldown
      )}\n`;
      info += `**Aliases**: ${
        command.aliases.length
          ? command.aliases.map(a => `\`${a}\``).join(", ")
          : "None"
      }\n`;
      info += `**Examples**: ${(description.examples || [])
        .map((x: string) => `\`${x}\``)
        .join(", ") || "None"}`;

      helpEmbed.setAuthor(
        `${command.aliases[0]} ${description.usage || ""}`,
        message.author.displayAvatarURL()
      );
      helpEmbed.setDescription(info);
    }
    message.channel.send(helpEmbed);
  }
}
