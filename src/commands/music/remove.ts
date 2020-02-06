import { Command } from "@vortekore/lib";
import { Message } from "discord.js";
import { In } from "../../util";

export default class extends Command {
  public constructor() {
    super("remove", {
      aliases: ["remove"],
      description: {
        content: "Removes a song from the queue.",
        usage: "<index>"
      },
      channel: "guild",
      args: [
        {
          id: "index",
          type: "number",
          prompt: {
            start: "Provide the index of the song you want to remove."
          }
        }
      ]
    });
  }

  public async exec(message: Message, { index }: { index: number }) {
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

    const i = Number(index) - 1;
    const tracks = message.queue.next;
    if (!tracks.length)
      return message.sem("There's nothing in the queue.", { type: "error" });

    if (tracks[i] === undefined)
      return message.sem("Sorry, that song doesn't exist :/", {
        type: "error"
      });

    const decoded = await this.client.music.decode(tracks[i]);
    message.queue.next.splice(
      tracks.findIndex(s => s === tracks[i]),
      1
    );

    return message.sem(
      `Successfully removed [${decoded.title}](${decoded.uri}) from the queue.`
    );
  }
}
