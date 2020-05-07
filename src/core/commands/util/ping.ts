import { Message } from "discord.js";
import { Command, CommandOptions } from "klasa";
import { Init } from "../../../lib";

@Init<CommandOptions>({
  name: "ping",
  description: (t) => t.get("cmds.ping.desc"),
})
export default class PingCommand extends Command {
  public async run(message: Message) {
    return message.reply(
      message.language.get("cmds.util.ping.res", this.client.ws.ping)
    );
  }
}
