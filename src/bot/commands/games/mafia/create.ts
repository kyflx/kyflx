import { Message, TextChannel } from "discord.js";
import { Command, MafiaGame } from "../../../../lib";

export default class CreateGame extends Command {
  public constructor() {
    super("mafia-create", {
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
    if (this.client.games.getGame(message.guild.id, "mafia"))
      return message.sem(message.t("cmds:games.maf.alr", { message }));

    const data = message._guild.games.mafia;
    if (!data.configured) return message.sem(message.t("cmds:games.maf.conf"));

    const game = new MafiaGame(this.client, message.guild.id);
    game.setupChannels(
      channel => message.guild.channels.resolve(data[channel]) as TextChannel
    );

    this.client.games.setGame(game.guild, "mafia", game);

    return message.sem(message.t("cmds:games.maf.start", { message }));
  }
}
