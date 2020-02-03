import { VorteEmbed } from "@vortekore/lib";
import { Argument, Command } from "discord-akairo";
import { Message, Util } from "discord.js";
import { In, paginate } from "../../util";
import ms = require("ms");

export default class SkipCommand extends Command {
  public constructor() {
    super("skip", {
      aliases: ["skip", "🚶", "🏃"],
      description: {
        content: "Skips the amount of songs you specify (defaults to 1)",
        usage: "<num>",
        examples: ["3", "1"]
      },
      category: "music",
      channel: "guild",
      ratelimit: 2,
      flags: ["-f"]
    });
  }

  public *args(msg: Message) {
    const force = yield {
      match: "flag",
      flag: ["--force", "-f"]
    };

    const num = yield msg.member!.roles.some(
      r => r.id !== msg._guild!.djRole
    ) && force
      ? {
          match: "rest",
          type: Argument.compose(
            (_, str) => str.replace(/\s/g, ""),
            Argument.range(Argument.union("number", "emojint"), 1, Infinity)
          )
        }
      : {
          match: "rest",
          type: Argument.compose(
            (_, str) => str.replace(/\s/g, ""),
            Argument.range(Argument.union("number", "emojint"), 1, 10)
          )
        };

    return { num };
  }

  public async exec(message: Message, { num }: { num: number }) {
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

    const queue = this.client.music.queues.get(message.guild!.id);

    let tracks;
    if (num > 1) tracks = await message.queue.tracks(0, num - 2);

    const current = await queue.current();

    tracks = [(current || { track: null }).track]
      .concat(tracks || [])
      .filter(track => track);

    const skip = await queue.next(num);

    if (!skip) {
      await queue.stop();
      return message.sem("Skipped the last playing song.");
    }

    const decoded = await this.client.music.decode(tracks as any[]);

    const totalLength = decoded.reduce(
      (prev, song) => prev + song.info.length,
      0
    );

    const paginated = paginate(decoded, 1, 10);
    let index = (paginated.page - 1) * 10;

    const embed = new VorteEmbed(message)
      .baseEmbed()
      .setAuthor(
        `${message.author.tag} (${message.author.id})`,
        message.author.displayAvatarURL()
      )
      .setDescription(
        [
          `**Skipped songs**`,
          paginated.items
            .map(
              song =>
                `**${++index}.** [${Util.escapeMarkdown(song.info.title)}](${song.info.uri}) *${ms(
                  song.info.length
                )}*`
            )
            .join("\n"),
          `**Total skipped time:** ${ms(totalLength)}`
        ].join("\n")
      );

    return message.util!.send(embed);
  }
}
