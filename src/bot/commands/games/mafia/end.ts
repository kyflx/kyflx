import { Message } from "discord.js";
import { Command, MafiaPlayer } from "../../../../lib";

export type MafiaWins = ["villagers" | "mafia", Array<MafiaPlayer>];

export default class EndGame extends Command {
  public constructor() {
    super("mafia-end", {
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

    game.channels.forEach(async channel => {
      channel.permissionOverwrites
        .filter(p => p.type === "member")
        .forEach(p =>
          channel.updateOverwrite(p.id, {
            VIEW_CHANNEL: false,
            SEND_MESSAGES: false
          })
        );
      await channel.bulkDelete(100, true);
    });

    this.client.games.deleteGame(message.guild.id, "mafia");
    if (!game.started) return message.sem(message.t("cmds:games.maf.cancel"));

    const winner = (): MafiaWins => {
      const mafiaAlive = game.sorted
        .get("mafia")
        .filter(player => !player.killed);
      const villagerAlive = [
        ...game.sorted.get("detective"),
        ...game.sorted.get("doctor"),
        ...game.sorted.get("villager")
      ].filter(player => !player.killed);

      if (mafiaAlive.length > villagerAlive.length)
        return ["mafia", mafiaAlive];
      return ["villagers", villagerAlive];
    };

    return message.sem(message.t("cmds:games.maf.end", { wins: winner() }));
  }
}
