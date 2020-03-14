import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Argument } from "discord-akairo";
import { GuildMember } from "discord.js";

export default class InvestigateSomeone extends Command {
  public constructor() {
    super("mafia-investigate", {
      userPermissions(message: Message) {
        const game = message.client.games.getGame(message.guild.id, "mafia");
        if (game && game.getPlayer(message.author.id).role !== "detective")
          return "Detective";
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
              else return true;
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
      return message.sem(message.t("cmds:games.maf.wait"), {
        type: "error"
      });

    const night = game.nights.last();
    if (night.investigated)
      return message.sem(message.t("cmds:games.maf.it"), {
        type: "error"
      });

    const result = night.investigate(suspect.id);
    return message.sem(
      message.t("cmds:games.maf.investi", { suspect, result })
    );
  }
}
