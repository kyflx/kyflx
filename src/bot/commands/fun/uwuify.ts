import { Message, TextChannel } from "discord.js";
import { UwU_Faces, Command } from "../../../lib";

export default class extends Command {
  public constructor() {
    super("uwu", {
      aliases: ["uwu", "uwuify"],
      args: [
        {
          id: "content",
          match: "rest",
          prompt: {
            start: (_: Message) => _.t("cmds:fun.uwu.prompt")
          }
        }
      ],
      description: t => t("cmds:fun.uwu.desc"),
      clientPermissions: "MANAGE_WEBHOOKS"
    });
  }

  public async exec(message: Message, { content }: { content: string }) {
    const face = () => UwU_Faces[Math.floor(Math.random() * UwU_Faces.length)];
    if (message.deletable) message.delete();
    content = content.replace("th", "d");
    content = content.replace("Th", "D");
    content = content.replace(" is", " ish");
    content = content.replace(" Is", " Ish");
    content = content.replace(/(?:l|r)/g, "w");
    content = content.replace(/(?:L|R)/g, "W");
    content = content.replace(/n([aeiou])/g, "ny$1");
    content = content.replace(/N([aeiou])/g, "Ny$1");
    content = content.replace(/N([AEIOU])/g, "Ny$1");
    content = content.replace(/ove/g, "uv");
    content = content.replace("!", ` ${face()} `);
    content = content.replace(".", ` ${face()} `);
    content = content.replace(",", ` ${face()} `);

    if (message.channel.type !== "text") return message.sem(content);

    const hook = await (<TextChannel>message.channel).createWebhook(
      message.author.username,
      {
        avatar: message.author.displayAvatarURL(),
        reason: "uwuify command"
      }
    );

    await hook.send(content);
    return hook.delete("End");
  }
}
