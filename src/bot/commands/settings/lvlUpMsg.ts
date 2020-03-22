import { Message, TextChannel } from "discord.js";
import { Command } from "../../../lib";

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
        await this.updateDb(message.guild, "channels.lvlUp", "");
        await message.sem(message.t("cmds:conf.lum.reset"));
        break;
      case "redirect":
        await this.updateDb(message.guild, "channels.lvlUp", channel.id);
        await message.sem(message.t("cmds:conf.lum.red", { channel }));
        break;
      case "enable":
      case "disable":
        await this.updateDb(message.guild, "lvlUpMessage", action === "enable");
        await message.sem(message.t(`cmds:conf.lum.${action}`));
        break;
    }
  }
}
