import { Message, TextChannel } from "discord.js";
import { Command, VorteEmbed } from "../../../lib";

export default class FeedbackCommand extends Command {
  public constructor() {
    super("feedback", {
      aliases: ["feedback", "thoughts"],
      description: t => t("cmds:util.fb.desc"),
      args: [
        {
          id: "feedback",
          match: "rest",
          prompt: {
            start: (_: Message) => _.t("cmds:util.fb.prompt")
          }
        }
      ]
    });
  }

  public async exec(message: Message, { feedback }: { feedback: string }) {
    const embed = new VorteEmbed(message)
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(feedback)
      .addField(
        "\u200b",
        `**Sent From**: ${
          message.guild ? `${message.guild.name} (${message.guild.id})` : "DMs"
        } `
      );
    await (this.client.channels.resolve(
      "631151085150797833"
    ) as TextChannel).send(embed);
    return message.sem(message.t("cmds:util.fb.sent"));
  }
}
