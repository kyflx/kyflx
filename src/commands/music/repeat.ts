import { Command } from "@vortekore/lib";
import { Message } from "discord.js";
import { In } from "../../util";

export default class extends Command {
  public constructor() {
    super("repeat", {
      aliases: ["repeat", "loop"],
      description: {
        content: "Repeats the queue or song.",
        examples: ["!repeat queue", "!repeat song"],
        usage: "<song|queue>"
      },
      args: [
        {
          id: "type",
          type: ["queue", ["track", "song"]],
          default: "track"
        }
      ],
      channel: "guild"
    });
  }

  public async exec(message: Message, { type }: { type: "queue" | "track" }) {
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

    switch (type) {
      case "track":
        const track = (message.queue.repeat.song = !message.player.queue
          .repeat.song);
        message.sem(
          `${track ? "Enabled" : "Disabled"} song repeat for the player.`
        );
        break;

      case "queue":
        const queue = (message.player.queue.repeat.queue = !message.player.queue
          .repeat.queue);
        message.sem(
          `${queue ? "Enabled" : "Disabled"} queue repeat for the player.`
        );
        break;
    }
  }
}
