import { Command, VorteMessage } from "@vortekore/lib";

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
      aliases: ["uwuify"],
      category: "Fun",
      cooldown: 500
    });
  }

  public async run(message: VorteMessage, [...content]: string[]) {
		if (message.deletable) message.delete();
    let string = content.join(" ");
    string = string.replace("th", "d");
    string = string.replace("Th", "D");
    string = string.replace(" is", " ish");
    string = string.replace(" Is", " Ish");
    string = string.replace(/(?:l|r)/g, "w");
    string = string.replace(/(?:L|R)/g, "W");
    string = string.replace(/n([aeiou])/g, "ny$1");
    string = string.replace(/N([aeiou])/g, "Ny$1");
    string = string.replace(/N([AEIOU])/g, "Ny$1");
    string = string.replace(/ove/g, "uv");
    string = string.replace(
      "!",
      ` ${faces[Math.floor(Math.random() * faces.length)]} `
    );
    string = string.replace(
      ".",
      ` ${faces[Math.floor(Math.random() * faces.length)]} `
    );
    string = string.replace(
      ",",
      ` ${faces[Math.floor(Math.random() * faces.length)]} `
    );
    return message.sem(string);
  }
}
