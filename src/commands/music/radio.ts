import { Command, equalsIgnoreCase, get } from "@vortekore/lib";
import { Message } from "discord.js";
import { RadioObject, In } from "../../util";

export default class extends Command {
  public constructor() {
    super("radio", {
      aliases: ["radio", "radio-station"],
      description: {
        content: "Plays a radio station into your voice channel.",
        usage: "<tags>",
        examples: ["v!radio lofi hiphop"]
      },
      channel: "guild",
      args: [
        {
          id: "tags",
          match: "separate"
        }
      ]
    });
  }

  public async exec(message: Message, { tags }: { tags: string[] }) {
    if (!message.guild.me.voice.channel)
      return message.sem("I'm not in a voice channel...", {
        type: "error"
      });

    if (!In(message.member!))
      return message.sem("Please join the voice channel I'm in.", {
        type: "error"
      });

    const fetched = await get<RadioObject[]>(
      `https://fr1.api.radio-browser.info/json/stations/bytag/${tags.join(",")}`
    );
    if (!fetched.data || !fetched.data.length) {
      console.error("radio command", fetched.error);
      return message.sem("Sorry, I couldn't find any stations with those tags");
    }

    let avaliableStations = fetched.data.filter(
      station =>
        Boolean(station.lastcheckok) && equalsIgnoreCase(station.codec, "mp3")
    );
    if (!avaliableStations.length)
      return message.sem("Sorry, I couldn't find any supported stations :(((", {
        type: "error"
      });
    avaliableStations = avaliableStations.slice(0, 10);

    let stations = `Please pick a radio station.\n`;
    avaliableStations.forEach((station, index) => {
      stations += `**${index + 1}.** [${station.countrycode}] ${
        station.name
      } [${station.tags
        .split(",")
        .slice(0, 5)
        .join(", ")}]\n`;
    });

    const choice = await message.sem(stations);
    try {
      const collected = await choice.channel.awaitMessages(
        (m: Message) => {
          if (m.author.id !== message.author.id) return false;
          else if (
            equalsIgnoreCase(m.content, "cancel") ||
            Number(m.content) > avaliableStations.length ||
            Number(m.content) < 1
          )
            return false;
          else return true;
        },
        {
          max: 1,
          errors: ["time"],
          time: 20000
        }
      );

      if (!collected.size || !collected.first())
        return message.sem(
          "C'mon man... I just needed a number 1 through 10 *sobs*"
        );

      if (equalsIgnoreCase(collected.first()!.content, "cancel"))
        return message.sem("Cancelled radio streaming...");

      const station = avaliableStations[Number(collected.first()!.content) - 1];
      if (!station)
        return message.sem(
          "HMMM, i think I broke, fuck... contact my developers :((((((",
          { type: "error" }
        );

      const search = await this.client.music.load(station.url_resolved);
      if (["NO_MATCHES", "LOAD_FAILED"].includes(search.loadType))
        return message.sem("Sorry, I guess we couldn't play this one :(", {
          type: "error"
        });

      message.player.radio = station;
      await message.player.play(search.tracks![0].track);
      return message.sem(
        `[${station.name}](${station.homepage})\n*you won't get updates when a new song plays*`
      );
    } catch (e) {
      return message.sem("Sorry buckaroo you ran out of time :p", {
        type: "error"
      });
    }
  }
}
