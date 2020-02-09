import { Message } from "discord.js";
import { VorteEmbed, Command } from "@vortekore/lib";

export default class extends Command {
  constructor() {
    super("emb", {
      aliases: ["embed"],
      description: t => t("cmds:util.emb.desc"),
      userPermissions: ["ADMINISTRATOR"],
      args: [
        {
          id: "content",
          match: "rest",
          prompt: {
            start: "Maybe you should provide some text :thonk:"
          }
        }
      ]
    });
  }

  public async exec(message: Message, { content }: { content: string }) {
    const emb = content.split("|").map(t => t.trim());

    if (!message.deletable)
      return message.util.send("Dont have permission to delete the message");

    message.delete();
    message.util.send(
      new VorteEmbed(message)
        .baseEmbed()
        .setTitle(emb[0])
        .setDescription(emb[1])
        .setFooter(message.author.tag, message.author.displayAvatarURL())
    );
  }
}
