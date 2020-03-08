import { Command, VorteEmbed } from "../../../lib";
import { Message } from "discord.js";
import ms = require("ms");

let wordArr: string[] = [
  "computer",
  "laptop",
  "internet",
  "discord",
  "food",
  "water",
  "cow",
  "cat",
  "dog",
  "sheep",
  "jester",
  "math",
  "global",
  "information",
  "game",
  "video",
  "example"
];

export default class TabooGameCommand extends Command {
  public constructor() {
    super("taboo", {
      aliases: ["taboo"],
      description: t => t("cmds:fun.tab.desc"),
      channel: "guild"
    });
  }

  public async exec(message: Message) {
    if (message._guild.games.taboo)
      return message.sem(message.t("cmds:fun.tab.alr"));

    const word = wordArr[Math.floor(Math.random() * wordArr.length)];
    message._guild.games.taboo = {
      host: message.author.id,
      word
    };
    await message._guild.save();

    message.author
      .send(
        new VorteEmbed(message).setDescription(
          message.t("cmds:fun.tab.dm", { word })
        )
      )
      .catch(() => {
        return message.sem(
          `Sorry, ${message.author}. Please open your DMs before starting a game.`
        );
      });

    message.sem(message.t("cmds:fun.tab.new", { message }));

    await message.channel
      .awaitMessages((message: Message) => message.content.ignoreCase(word), {
        max: 1,
        errors: ["time"],
        time: ms("2m")
      })
      .then(
        async all => {
          const first = all.first();
          if (first.author.id === message.author.id)
            return message.sem(message.t("cmds:fun.tab.cheat"), { _new: true });

          const amount = Math.floor(Math.random() * 100) + 5;
          const profile = await this.client.findOrCreateProfile(
            first.author.id,
            first.guild.id
          );
          profile.coins += amount;
          await profile.save();

          return message.sem(
            message.t("cmds:fun.tab.end", { first, word, amount }),
            { _new: true }
          );
        },
        () => message.sem(message.t("cmds:fun.tab.timesup"))
      );

    delete message._guild.games.taboo;
    return message._guild.save();
  }
}
