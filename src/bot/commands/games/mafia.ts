import { Flag } from "discord-akairo";
import { Message } from "discord.js";
import { Command, VorteEmbed } from "../../../lib";

export default class MafiaCommand extends Command {
  public constructor() {
    super("mafia", {
      aliases: ["mafia"],
      *args(message: Message) {
        const action = yield {
          type: [
            ["create", "new"],
            ["end", "stop", "cancel"],
            "investigate",
            "join",
            "kill",
            "leave",
            "save",
            "sleep",
            "start",
            "wake"
          ],
          otherwise: new VorteEmbed(message).setDescription(
            message.t("cmds:games.maf.prompt")
          )
        };

        return Flag.continue(`mafia-${action}`);
      }
    });
  }
}
