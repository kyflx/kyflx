import { Command } from "@vortekore/lib";
import { Message } from "discord.js";
import { In } from "../../util";

export default class extends Command {
  public constructor() {
    super("remove", {
      aliases: ["remove"],
      description: t => t("cmds:music.rm.desc"),
      channel: "guild",
      args: [
        {
          id: "index",
          type: "number",
          prompt: {
            start: (_: Message) => _.t("cmds:music.rm.prompt")
          }
        }
      ]
    });
  }

  public async exec(message: Message, { index }: { index: number }) {
    if (!message.guild.me.voice.channel)
      return message.sem(message.t("cmds:music.no_vc"), {
        type: "error"
      });

    if (!In(message.member!))
      return message.sem(message.t("cmds:music.join"), {
        type: "error"
      });

    if (message.player.radio)
      return message.sem(message.t("cmds:music.rad"), {
        type: "error"
      });

    const i = Number(index) - 1;
    const tracks = message.queue.next;
    if (!tracks.length)
      return message.sem(message.t("cmds:music.queue.empty"), {
        type: "error"
      });

    if (tracks[i] === undefined)
      return message.sem(message.t("cmds:music.rm.nope"), {
        type: "error"
      });

    const decoded = await this.client.music.decode(tracks[i]);
    message.queue.next.splice(
      tracks.findIndex(s => s === tracks[i]),
      1
    );

    return message.sem(message.t("cmds:music/rm.res", { decoded }));
  }
}
