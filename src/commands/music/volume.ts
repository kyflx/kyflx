import { Command } from "@vortekore/lib";
import { Message } from "discord.js";
import { Argument } from "discord-akairo";
import { developers } from "../..";
import { In } from "../../util";

export default class extends Command {
  public constructor() {
    super("volume", {
      aliases: ["volume", "vol"],
      userPermissions(message: Message) {
        if (
          developers.includes(message.author.id) ||
          message.member!.hasPermission("ADMINISTRATOR")
        )
          return;
        else if (
          message._guild!.djRole &&
          message.member!.roles.some(r => r.id !== message._guild!.djRole)
        )
          return "DJ";
        return;
      },
      channel: "guild",
      args: [
        {
          id: "volume",
          type: Argument.range("number", 1, 100),
          prompt: {
            start: "Provide a valid number between 1-100."
          }
        }
      ]
    });
  }

  public async exec(message: Message, { volume }: { volume: number }) {
    if (!message.guild.me.voice.channel)
      return message.sem("I'm not in a voice channel...", {
        type: "error"
      });

    if (!In(message.member!))
      return message.sem("Please join the voice channel I'm in.", {
        type: "error"
      });

    message.sem(`Changed the volume from ${100} to ${volume}`);
    await message.player.setVolume(volume);
  }
}
