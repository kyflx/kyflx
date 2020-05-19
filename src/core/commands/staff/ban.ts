import { Command } from "klasa";
import { GuildCommand } from "../../../lib";
import { Message } from "discord.js";

@GuildCommand({
  permissionLevel: 6,
  usage: "<member:...member{1,10}> [reason:...string]",
  usageDelim: " ",
  requiredPermissions: "BAN_MEMBERS"
})
export default class BanCommand extends Command {
  public async run(message: Message, params: any[]) {
    return message.send("oof");
  }
}
