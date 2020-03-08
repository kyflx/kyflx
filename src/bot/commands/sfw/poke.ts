import { GuildMember, Message } from "discord.js";
import { Command, get, Nekos, SFW_LINKS, VorteEmbed } from "../../../lib";

export default class extends Command {
  public constructor() {
    super("poke", {
      aliases: ["poke"],
      description: t => t("cmds:sfw.poke.desc"),
      args: [
        {
          id: "member",
          default: (_: Message) => _.guild.me,
          type: "member"
        }
      ]
    });
  }

  public async exec(message: Message, { member }: { member: GuildMember }) {
    const { data, error } = await get<Nekos>(SFW_LINKS.poke);
    if (!data) {
      this.logger.error(error);
      return message.sem(`Sorry, we ran into an error :(`, { type: "error" });
    }

    return message.util.send(
      new VorteEmbed(message)
        .setDescription(`***${message.author}** pokes **${member}***`)
        .setImage(data.url)
    );
  }
}
