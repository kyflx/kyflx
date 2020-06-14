import { Message } from "discord.js";
import { Command, CommandOptions, Piece, Stopwatch, Store } from "klasa";
import { Init } from "../../../lib";

@Init<CommandOptions>({ usage: "<store:store|piece:piece|all>" })
export default class extends Command {
  public async run(
    message: Message,
    [ toReload ]: [ Store<string, Piece> | Piece | "all" ]
  ) {
    const stopwatch = new Stopwatch();
    try {
      if (toReload instanceof Store) {
        stopwatch.start();
        await Promise.all(toReload.map((p) => p.reload()));
        return message.reply(
          `Reloaded **${toReload.size}** ${
            toReload.name
          } in *${stopwatch.stop()}*`
        );
      } else if (toReload === "all") {
        stopwatch.start();
        await Promise.all(
          this.client.pieceStores.map((s) => s.map((p: Piece) => p.reload()))
        );
        return message.reply(`Reloaded all pieces in *${stopwatch.stop()}*`);
      } else {
        stopwatch.start();
        await toReload.reload();
        return message.reply(
          `Reloaded the **${toReload.name}** ${
            toReload.type
          } successfully in *${stopwatch.stop()}*`
        );
      }
    } catch (error) {
      return message.reply(`\`\`\`js\n${error}\`\`\``);
    }
  }
}
