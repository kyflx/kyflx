import { Message } from "discord.js";
import { Command, MafiaRole, VorteEmbed } from "../../../lib";

export default class ModeratorRole extends Command {
  public constructor() {
    super("mafia-limits", {
      aliases: ["mafia-limits", "mafia-role-limits", "mrl"],
      description: t => t("cmds:conf.lims.desc"),
      *args(message: Message) {
        const role = yield {
          type: ["detective", "doctor", "mafia", "villager"],
          otherwise: new VorteEmbed(message).setDescription(
            message.t("cmds:conf.lims.cur", { message })
          )
        };

        return {
          role,
          limit: yield role
            ? {
                type: "number",
                prompt: {
                  start: message.t("cmds:conf.lims.limit", { role })
                }
              }
            : {}
        };
      },
      channel: "guild",
      userPermissions: "MANAGE_GUILD"
    });
  }

  public async exec(
    message: Message,
    { role, limit }: { role: MafiaRole; limit: number }
  ) {
    const guild = message._guild.games.mafia;

    // @ts-ignore
    guild[`${role}Limit`] = limit;
    await this.updateDb(message.guild, "games.mafia", guild);
    return message.sem(`Configured the role limits.`);
  }
}
