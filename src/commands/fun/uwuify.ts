import { Command } from "@vortekore/lib";
import { Message } from "discord.js";

const faces = [
  "(*^ω^)",
  "(◕‿◕✿)",
  "(◕ᴥ◕)",
  "ʕ•ᴥ•ʔ",
  "ʕ￫ᴥ￩ʔ",
  "(*^.^*)",
  "owo",
  "(｡♥‿♥｡)",
  "uwu",
  "(*￣з￣)",
  ">w<",
  "^w^",
  "(つ✧ω✧)つ",
  "(/ =ω=)/"
];

export default class extends Command {
  public constructor() {
    super("uwu", {
      aliases: ["uwu", "uwuify"],
      args: [
        {
          id: "content",
          match: "rest",
          prompt: {
            start: "Provide some text I can uwuify"
          }
        }
      ],
      description: {
        content: "Uwuify's your message",
        usage: "<message>",
        examples: ["v!uwu x3 nuzzles pounces on you uwu u so warm!"]
      }
    });
  }

  public async exec(message: Message, { content }: { content: string }) {
    if (message.deletable) message.delete();
    content = content.replace("th", "d");
    content = content.replace("Th", "D");
    content = content.replace(" is", " ish");
    content = content.replace(" Is", " Ish");
    content = content.replace(/(?:l|r)/g, "w");
    content = content.replace(/(?:L|R)/g, "W");
    content = content.replace(/n([aeiou])/g, "ny$1");
    content = content.replace(/N([aeiou])/g, "Ny$1");
    content = content.replace(/N([AEIOU])/g, "Ny$1");
    content = content.replace(/ove/g, "uv");
    content = content.replace(
      "!",
      ` ${faces[Math.floor(Math.random() * faces.length)]} `
    );
    content = content.replace(
      ".",
      ` ${faces[Math.floor(Math.random() * faces.length)]} `
    );
    content = content.replace(
      ",",
      ` ${faces[Math.floor(Math.random() * faces.length)]} `
    );
    return message.sem(content);
  }
}
