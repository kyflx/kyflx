import {
  Command,
  CommandDescription,
  VorteEmbed,
  developers,
  CategoryPredicate
} from "../../../lib";
import { Message } from "discord.js";

export default class HelpCommand extends Command {
  public constructor() {
    super("help", {
      aliases: ["help", "commands", "?"],
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
    const helpEmbed = new VorteEmbed(message);

    if (!command) {
      helpEmbed.setAuthor("All Commands", message.author.displayAvatarURL());
      helpEmbed.setDescription(
        "**Syntax**: <Required> [Optional] <[Depends on Previous Argument]> "
      );

      this.handler.categories
        .filter(CategoryPredicate(message))
        .each((category, name) =>
          helpEmbed.addField(
            `**•** ${name.replace(/(\b\w)/gi, lc => lc.toUpperCase())} (${
              category.size
            })`,
            category
              .filter(c => (c.aliases ? c.aliases.length > 0 : false))
              .map(c => `\`${c.aliases[0]}\``)
              .join(", ")
          )
        );

      return message.util.send(helpEmbed);
    }

    const description: CommandDescription =
      typeof command.description === "function"
        ? command.description(message.t.bind(message))
        : {};

    helpEmbed.setAuthor(
      `${command.aliases[0]} ${description.usage || ""}`,
      message.author.displayAvatarURL()
    );

    helpEmbed.setDescription(
      [
        description.content ? `${description.content}\n` : null,
        `**Aliases**: ${(command.aliases as string[])
          .slice(1)
          .map(a => `\`${a}\``)
          .join(", ") || "None"}`
      ].join("\n")
    );

    if (description.examples && description.examples.length > 0)
      helpEmbed.addField(
        "• Examples",
        description.examples.map((e: string) => `\`${e}\``).join("\n")
      );

    return message.util.send(helpEmbed);
  }
}
