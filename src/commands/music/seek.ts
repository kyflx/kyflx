import { Command } from "@vortekore/lib";
import { Message } from "discord.js";
import { In } from '../../util';

export default class extends Command {
  public constructor() {
    super("seek", {
      aliases: ["seek"],
      description: {
        examples: ["!seek 5s"],
        content: "Seeks to a position in the song",
        usage: "<time>"
      },
      channel: "guild",
      args: [
        {
          id: "time",
          prompt: {
            start:
              "Please provide a time to skip in (provide it in seconds or minutes, Example: !seek 5s)"
          },
          type: /(.*)[m|s]/
        }
      ]
    });
  }

  public async exec(message: Message, { time }: { time: { match: number[] } }) {
    if (!message.guild.me.voice.channel)
      return message.sem("I'm not in a voice channel...", {
        type: "error"
      });

    if (!In(message.member!))
      return message.sem("Please join the voice channel I'm in.", {
        type: "error"
      });
    if (message.player.radio)
      return message.sem("Sorry, the player is currently in radio mode :p", {
        type: "error"
      });

    await message.player.seek(Number(time.match[1]) * 1000);
    return message.sem(`Seeked to the requested position!`);
  }
}
