import { Argument } from "discord-akairo";
import { GuildMember, Message } from "discord.js";
import { Command } from "../../../../lib";

export default class InvestigateSomeone extends Command {
  public constructor() {
    super("mafia-kill", {
      userPermissions(message: Message) {
        const game = message.client.games.getGame(message.guild.id, "mafia");
        if (game && game.getPlayer(message.author.id).role !== "mafia")
          return "Mafia";
        return;
      },
      ignorePermissions: ["396096412116320258"],
      args: [
        {
          id: "suspect",
          type: Argument.validate(
            "member",
            (message: Message, _, value: GuildMember) => {
              const game = this.client.games.getGame(message.guild.id, "mafia"),
                player = game.getPlayer(value.id);
              if (!game) return true;
              if (value.id !== message.author.id && (!player || player.killed))
                return false;
              return true;
            }
          ),
          prompt: {
            start: (_: Message) => _.t("cmds:games.maf.uprompt"),
            retry: (_: Message) => _.t("cmds:games.maf.uprompt")
          }
        }
      ],
      category: "flag"
    });
  }

  public async exec(message: Message, { suspect }: { suspect: GuildMember }) {
    const game = this.client.games.getGame(message.guild.id, "mafia");
    if (!game)
      return message.sem(message.t("cmds:games.maf.create", { message }), {
        type: "error"
      });

    if (!game.started)
      return message.sem(message.t("cmds:games.maf.wait"), { type: "error" });

    const night = game.nights.last();
    if (night.killed)
      return message.sem(message.t("cmds:games.maf.ckm1"), { type: "error" });

    night.kill(suspect.id);
    return message.sem(message.t("cmds:games.maf.pend", { suspect }));
  }
}
