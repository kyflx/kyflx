import { Command } from "@vortekore/lib";
import { Message } from "discord.js";
import { In } from "../../util";

export default class extends Command {
  public constructor() {
    super("leave", {
      aliases: ["leave", "stop"],
      channel: "guild",
      args: [
        {
          id: "clear",
          match: "flag",
          flag: ["--clear", "-c"]
        }
      ]
    });
  }

  public async exec(message: Message, { clear }: { clear: boolean }) {
    if (!message.guild.me.voice.channel)
      return message.sem("I'm not in a voice channel...", { type: "error" });

    if (!In(message.member!))
      return message.sem("Please join the voice channel I'm in.", {
        type: "error"
      });

    const dj = message.member!.roles.some(r => r.id !== message._guild!.djRole);
    if (clear && dj) await message.queue.clear();

    await message.player.destroy();
    if (message.guild.me.voice.channel) await message.player.leave();

    return message.sem("Successfully left the voice channel.");
  }
}
