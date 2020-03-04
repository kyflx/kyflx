import { Command } from "../../../lib";
import { Message, TextChannel } from "discord.js";

export default class LevelUpMessageCommand extends Command {
  public constructor() {
    super("lvl-up-msg", {
      aliases: ["lvl-up-msg", "lum"],
      description: t => t("cmds:conf.lum.desc"),
      channel: "guild",
      *args(_: Message) {
        const action = yield {
          type: ["redirect", ["disable", "off"], ["enable", "on"], "reset"]
        };

        const channel =
          action === "redirect"
            ? yield {
                type: "textChannel",
                prompt: {
                  start: _.t("cmds:conf.lum.prompt")
                }
              }
            : {};

        return { action, channel };
      }
    });
  }

  public async exec(
    message: Message,
    { action, channel }: { action: string; channel: TextChannel }
  ) {
    if (!action)
      return message.sem(message.t("cmds:conf.lum.curr", { message }));

    switch (action) {
      case "reset":
        message._guild.lvlUpChannel = "";
        await message._guild.save();
        await message.sem(message.t("cmds:conf.lum.reset"));
        break;
      case "redirect":
        message._guild.lvlUpChannel = channel.id;
        await message._guild.save();
        await message.sem(message.t("cmds:conf.lum.red", { channel }));
        break;
      case "enable":
      case "disable":
        message._guild.lvlUpMsg = action === "enable";
        await message._guild.save();
        await message.sem(message.t(`cmds:conf.lum.${action}`));
        break;
    }
  }
}
