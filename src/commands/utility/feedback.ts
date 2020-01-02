import { Command, VorteEmbed } from "@vortekore/lib";
import { TextChannel, Message } from "discord.js";

export default class extends Command {
  public constructor() {
    super("feedback", {
      aliases: ["feedback", "thoughts"],
      description: {
        content: "Provide feedback on the bot!",
        usage: "<thoughts>",
        examples: ["!feedback fix stuff", "!feedback amazing music quality!"]
      },
      args: [{
        id: "feedback",
        match: "rest",
        prompt: {
          start: "Maybe you should put something next time."
        }
      }]
    });
  }

  public async exec(message: Message, { feedback }: { feedback: string }) {
    const Feedback = new VorteEmbed(message)
      .baseEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(feedback)
      .addField(
        "\u200b",
        `**Sent From**: ${message.guild ? `${message.guild.name} (${message.guild.id})` : "DMs"} `
      );
    await (<TextChannel>this.client.channels.get("631151085150797833")!).send(
      Feedback
    );
    return message.sem("Feedback sent! Thanks <3");
  }
}
