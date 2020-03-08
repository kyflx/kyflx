import { Message, TextChannel } from "discord.js";
import { Command, get, FUN_LINKS } from "../../../lib";

export default class extends Command {
  public constructor() {
    super("spoiler", {
      aliases: ["spoiler"],
      args: [
        {
          id: "content",
          match: "rest",
          prompt: {
            start: (_: Message) => _.t("cmds:fun.spo.prompt")
          }
        }
      ],
      description: t => t("cmds:fun.spo.desc"),
      clientPermissions: "MANAGE_WEBHOOKS"
    });
  }

  public async exec(message: Message, { content }: { content: string }) {
    if (message.deletable) message.delete();
    const { error, data } = await get<{ owo: string }>(
      `${FUN_LINKS.spoiler}?text=${encodeURIComponent(content)}`
    );

    if (error) {
      this.logger.error(error, "spoiler");
      return message.sem(message.t("cmds:fun.spo.error"));
    }
    if (message.channel.type !== "text") return message.sem(content);

    const hook = await (<TextChannel>message.channel).createWebhook(
      message.author.username,
      {
        avatar: message.author.displayAvatarURL(),
        reason: "spoiler command"
      }
    );

    await hook.send(data.owo);
    return hook.delete("End");
  }
}
