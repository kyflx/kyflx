import { Message } from "discord.js";
import { Command } from "../../../../lib";

export default class leaveGame extends Command {
  public constructor() {
    super("mafia-leave", {
      category: "flag"
    });
  }

  public async exec(message: Message) {
    const game = this.client.games.getGame(message.guild.id, "mafia"),
      entry = message._guild.games.mafia;
    if (!game)
      return message.sem(message.t("cmds:games.maf.create", { message }), {
        type: "error"
      });

    if (message.member.roles.cache.get(entry.moderatorRole))
      return message.sem(message.t("cmds:games.maf.urm"));

    if (game.started)
      return message.sem(message.t("cmds:games.maf.finish"))

    if (!game.getPlayer(message.author.id))
      return message.sem(message.t("cmds:games.maf.join"));
    await game.addPlayer(message.author.id);

    return message.sem(message.t("cmds:games.maf.left"));
  }
}
