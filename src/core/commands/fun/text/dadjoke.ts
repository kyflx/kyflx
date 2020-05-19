import { Message } from "discord.js";
import { Command } from "klasa";
import fetch from "node-fetch";

export default class DadJokeCommand extends Command {
  public async run(message: Message) {
    const { joke, status } = await fetch("https://icanhazdadjoke.com", {
      headers: {
        Accept: "application/json",
        "User-Agent": "Kyflx Discord Bot [github.com/kyflx] (NodeJS, v3.0.0)",
      },
    }).then((res) => res.json());

    if (status !== 200) return message.reply(message.t("fun.dadjoke.!200"));

    return message.reply(joke as string);
  }
}
