import { Command, VorteEmbed } from "../../../lib";
import { Message, User } from "discord.js";

export default class extends Command {
  public constructor() {
    super("avatar", {
      aliases: ["avatar", "ava", "av", "pfp"],
      description: t => t("cmds:util.ava.desc"),
      args: [
        {
          id: "user",
          type: "user",
          default: (message: Message) => message.author
        }
      ]
    });
  }

  public async exec(message: Message, { user }: { user: User }) {
    return message.util.send(
      new VorteEmbed(message).setImage(
        user.displayAvatarURL({ dynamic: true, size: 2048 })
      )
    );
  }
}
