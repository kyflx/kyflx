import { Command } from "@vortekore/lib";
import { Message } from "discord.js";
import { In } from '../../util';

export default class extends Command {
  public constructor() {
    super("pause", {
      aliases: ["pause"],
      description: { content: "Pauses the player if not already resumed." },
      channel: "guild"
    });
  }

  public async exec(message: Message) {
    if (!message.guild.me.voice.channel)
      return message.sem("I'm not in a voice channel...", { type: "error" });

    if (!In(message.member))
      return message.sem("Please join the voice channel I'm in.", {
        type: "error"
      });

    if (message.player.paused)
      return message.sem(`I'm already paused... :p`,);

    await message.player.pause();
    return message.sem(`Successfully paused the player!`);
  }
}
