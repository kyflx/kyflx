import { Command } from "../../../lib";
import { Message } from "discord.js";

export default class extends Command {
  public constructor() {
    super("pin", {
      aliases: ["pin", "pin-message", "pin-msg"],
      channel: "guild",
      description: t => t("cmds:mod.pin.desc"),
      userPermissions: ["MANAGE_MESSAGES"],
      clientPermissions: ["MANAGE_MESSAGES"],
      args: [
        {
          id: "msg",
          prompt: {
            start: (_: Message) => _.t("cmds:mod.pin.prompt", { action: "pin" })
          },
          type: "message"
        }
      ]
    });
  }

  public async exec(message: Message, { msg }: { msg: Message }) {
    if (msg.pinned) return message.sem(message.t("cmds:mod.pin.alr"));
    if (!msg.pinnable) return message.sem(message.t("cmds:mod.pin.can't"));
    await msg.pin();
  }
}
