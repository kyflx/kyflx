import { Command } from "@vortekore/lib";
import { Message } from "discord.js";
import { In } from '../../util';

export default class extends Command {
  public constructor() {
    super("resume", {
      aliases: ["resume"],
      description: {
        content: "Resumes the player if not already paused."
      },
      channel: "guild"
    });
  }

  public async exec(message: Message) {
    if (!message.guild.me.voice.channel)
      return message.sem("I'm not in a voice channel...", {
        type: "error"
      });

    if (!In(message.member!))
      return message.sem("Please join the voice channel I'm in.", {
        type: "error"
      });
    if (!message.player.paused) return message.sem(`I'm not paused... :p`);

    await message.player.pause(false);
    return message.sem(`Successfully resumed the player!`);
  }
}
