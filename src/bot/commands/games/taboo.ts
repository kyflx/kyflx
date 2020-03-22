import { Message } from "discord.js";
import { Command, VorteEmbed, wordArr } from "../../../lib";

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
    await message.update("games.taboo", {
      host: message.author.id,
      word
    });

    message.author
      .send(
        new VorteEmbed(message).setDescription(
          message.t("cmds:fun.tab.dm", { word })
        )
      )
      .catch(() =>
        message.sem(
          `Sorry, ${message.author}. Please open your DMs before starting a game.`
        )
      );

    await message.sem(message.t("cmds:fun.tab.new", { message }));

    await message.channel
      .awaitMessages((m: Message) => m.content.ignoreCase(word), {
        max: 1,
        errors: ["time"],
        time: 120000
      })
      .then(
        async all => {
          const first = all.first();
          if (first.author.id === message.author.id)
            return message.sem(message.t("cmds:fun.tab.cheat"), { _new: true });

          const amount = Math.floor(Math.random() * 100) + 25;
          const profile = await this.client.ensureProfile(
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

    return message.update("games.taboo", null);
  }
}
