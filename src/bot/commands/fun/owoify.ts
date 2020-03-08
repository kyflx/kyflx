import { Message, TextChannel } from "discord.js";
import { Command, get, FUN_LINKS } from "../../../lib";

export default class extends Command {
  public constructor() {
    super("owo", {
      aliases: ["owo", "owoify"],
      args: [
        {
          id: "content",
          match: "rest",
          prompt: {
            start: (_: Message) => _.t("cmds:fun.owo.prompt")
          }
        }
      ],
      description: t => t("cmds:fun.owo.desc"),
      clientPermissions: "MANAGE_WEBHOOKS"
    });
  }

  public async exec(message: Message, { content }: { content: string }) {
    if (message.deletable) message.delete();

    const { error, data } = await get<{ owo: string }>(
      `${FUN_LINKS.owoify}?text=${encodeURIComponent(content)}`
    );

    if (error || !data) return message.sem(message.t("cmds:fun.owo.error"))
    if (message.channel.type !== "text") return message.sem(content);

    const hook = await (<TextChannel>message.channel).createWebhook(
      message.author.username,
      {
        avatar: message.author.displayAvatarURL(),
        reason: "owoify command"
      }
    );

    await hook.send(data.owo);
    return hook.delete("End");
  }
}
