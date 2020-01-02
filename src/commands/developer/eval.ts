import { Command, VorteEmbed } from "@vortekore/lib";
import { Message } from "discord.js";
import { isPromise } from "../../util";

export default class extends Command {
  public constructor() {
    super("eval", {
      aliases: ["eval", "evaluate"],
      description: {
        content: "Nothing lol",
        examples: ["veval <code>"],
        usage: "!ban <code>"
      },
      ownerOnly: true,
      args: [
        {
          id: "code",
          prompt: {
            start: "Provide some code to evaluate."
          },
          match: "rest"
        }
      ]
    });
  }

  public async exec(message: Message, { code }: { code: string }) {
    let embed;
    try {
      let resulted = eval(code);
      if (isPromise(resulted)) resulted = await resulted;
      const ctype = typeof resulted;
      if (typeof resulted !== "string") {
        resulted = require("util").inspect(resulted, {
          depth: 0
        });
      }
      embed = new VorteEmbed(message)
        .baseEmbed()
        .setTitle("Evaluation")
        .addField("Input", `\`\`\`js\n${code}\`\`\``)
        .addField("Output", `\`\`\`js\n${resulted}\`\`\``)
        .addField("Type", `\`\`\`js\n${ctype}\`\`\``);
      message.channel.send(embed);
    } catch (e) {
      embed = new VorteEmbed(message)
        .baseEmbed()
        .setTitle("Error")
        .setColor("#ff0000")
        .addField("Input", `\`\`\`js\n${code}\`\`\``)
        .addField("Error", `\`\`\`js\n${e.name}: ${e.message}\`\`\``);
      message.channel.send(embed);
    }
  }
}
