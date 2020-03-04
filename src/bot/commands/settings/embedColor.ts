import { Command } from "../../../lib";
import { Message } from "discord.js";

export default class extends Command {
  public constructor() {
    super("embed-color", {
      aliases: ["guild-color", "embed-color"],
      description: t => t("cmds:conf.emb_c.desc"),
      channel: "guild",
      userPermissions: ["MANAGE_GUILD"],
      args: [
        {
          id: "color",
          type: "color"
        }
      ]
    });
  }

  public async exec(message: Message, { color }: { color: number }) {
    if (!color)
      return message.sem(
        `The current color for this guild is **${(<any>(
          message._guild.embedColor
        )).toString(16)}**`
      );

    (message._guild.embedColor as any) = color;
    await message._guild.save();

    return message.sem(
      `Okay I set the embed color to **#${color.toString(16)}**`
    );
  }
}
