import { GuildMember, Message } from "discord.js";
import { Command, get, Nekos, SFW_LINKS, VorteEmbed } from "../../../lib";

export default class extends Command {
  public constructor() {
    super("baka", {
      aliases: ["baka"],
      description: t => t("cmds:sfw.baka.desc"),
      args: [
        {
          id: "member",
          type: "member"
        }
      ]
    });
  }

  public async exec(message: Message, { member }: { member: GuildMember }) {
    const { data, error } = await get<Nekos>(SFW_LINKS.baka);
    if (!data) {
      this.logger.error(error);
      return message.sem(`Sorry, we ran into an error :(`, { type: "error" });
    }

    return message.util.send(
      new VorteEmbed(message)
        .setDescription(
          `***${message.author}** ${
            member ? `calls **${member}** a baka.` : "is a baka"
          }*`
        )
        .setImage(data.url)
    );
  }
}
