import ms = require("ms");
import { Command, VorteEmbed } from "@vortekore/lib";
import Verta from "../../plugins/Music";
import { Argument } from "discord-akairo";
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
          type: Argument.validate("string", (_, phrase: string) => {
            const commands = [
              ...this.client.commands.modules.values(),
              ...this.client.music.commands
            ];

            return commands.some(c =>
              c.aliases.some(a => a.ignoreCase(phrase))
            );
          })
        }
      ]
    });
  }

  public async exec(message: Message, { command }: { command: string }) {
    const helpEmbed = new VorteEmbed(message).baseEmbed(),
      music = <Verta>(<any>this.client).music;

    if (!command) {
      helpEmbed.setAuthor("All Commands", message.author.displayAvatarURL());
      for (const [name, category] of this.client.commands.categories) {
        if (category.size)
          helpEmbed.addField(
            name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
            category.map(c => `\`${c.aliases[0]}\``).join(", "),
            true
          );
      }
      helpEmbed.addField(
        "Music",
        music.commands.map(c => `\`${c.aliases[0]}\``).join(", "),
        true
      );
    } else {
      let info = "";
      const cmd =
        this.handler.findCommand(command) ||
        music.commands.find(c => c.aliases.some(a => a.ignoreCase(command)));

      const description = cmd.description
        ? cmd.description
        : { usage: "", content: "", examples: [] };
      info += `**Category**: ${cmd.categoryID}\n`;
      info += `**Description**: ${description.content || "None"}\n`;
      info += `**Cooldown**: ${ms(cmd.cooldown || this.client.commands.defaultCooldown)}\n`;
      info += `**Aliases**: ${
        cmd.aliases.length
          ? cmd.aliases.map(a => `\`${a}\``).join(", ")
          : "None"
      }\n`;
      info += `**Examples**: ${description.examples.map(
        (x: string) => `\`${x}\``
      ).join(", ") || "None"}`;

      helpEmbed.setAuthor(
        `${cmd.aliases[0]} ${
          (cmd.description ? cmd.description : { usage: "" }).usage
        }`,
        message.author.displayAvatarURL()
      );
      helpEmbed.setDescription(info);
    }
    message.channel.send(helpEmbed);
  }
}
