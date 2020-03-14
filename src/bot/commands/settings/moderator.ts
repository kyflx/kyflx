import { Message, Role } from "discord.js";
import { Command, VorteEmbed } from "../../../lib";

export default class ModeratorRole extends Command {
  public constructor() {
    super("mafia-moderator-role", {
      aliases: ["mafia-moderator-role", "mafia-moderator", "mmr"],
      description: t => t("cmds:conf.modr.desc"),
      args: [
        {
          id: "moderator",
          otherwise: (_: Message) =>
            new VorteEmbed(_).setDescription(_.t("cmds:conf.modr.cur", { _ })),
          type: "role"
        }
      ],
      channel: "guild",
      userPermissions: "MANAGE_GUILD"
    });
  }

  public async exec(message: Message, { moderator }: { moderator: Role }) {
    message._guild.games.mafia.moderatorRole = moderator.id;
    await message._guild.save();
    return message.sem(message.t("cmds:conf.modr.new", { moderator }));
  }
}
