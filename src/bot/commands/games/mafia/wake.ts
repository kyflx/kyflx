import { Command } from "../../../../lib";
import { Message } from "discord.js";

export default class CreateGame extends Command {
  public constructor() {
    super("mafia-wake", {
      userPermissions(message: Message) {
        const role = message._guild.games.mafia.moderatorRole;
        if (!role || !message.member.roles.cache.get(role))
          return "Game Moderator";
        return;
      },
      category: "flag"
    });
  }

  public async exec(message: Message) {
    const game = this.client.games.getGame(message.guild.id, "mafia");
    if (!game)
      return message.sem(message.t("cmds:games.maf.create", { message }), {
        type: "error"
      });

    const role = <"doctor" | "mafia" | "detective" | "daytime">(
      game.channels.findKey(tc => tc.id === message.channel.id)
    );
    return game.wake(role === "daytime" ? undefined : role);
  }
}
