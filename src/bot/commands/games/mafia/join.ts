import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class JoinGame extends Command {
  public constructor() {
    super("mafia-join", {
      category: "flag"
    });
  }

  public async exec(message: Message) {
    const game = this.client.games.getGame(message.guild.id, "mafia");
    if (!game)
      return message.sem(message.t("cmds:games.maf.create", { message }), {
        type: "error"
      });

    if (message.member.roles.cache.get(game.entry.games.mafia.moderatorRole))
      return message.sem(message.t("cmds:games.maf.urm"));

    if (game.started)
      return message.sem(message.t("cmds:games.maf.alrs"));

    if (game.getPlayer(message.author.id))
      return message.sem(message.t("cmds:games.maf.alrj", { message }));

    await message.member.roles.add(game.entry.games.mafia.playerRole);
    await game.addPlayer(message.author.id);

    return message.sem(message.t("cmds:games.maf.joined"));
  }
}
