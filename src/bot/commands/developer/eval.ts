import { Message } from "discord.js";
import { Command, isPromise, KyflxEmbed } from "../../../lib";

export default class extends Command {
  public constructor() {
    super("eval", {
      aliases: ["eval", "evaluate"],
      description: t => t("cmds:dev.eval.desc"),
      ownerOnly: true,
      args: [
        {
          id: "code",
          prompt: {
            start: "Provide some code to evaluate."
          },
          match: "rest"
        },
        {
          id: "depth",
          match: "option",
          flag: ["-d=", "d:", "--depth=", "--depth:"]
        },
        {
          id: "silent",
          match: "flag",
          flag: ["-s", "--silent", ":s"]
        },
        {
          id: "async",
          match: "flag",
          flag: ["-a", "--async", ":a"]
        }
      ]
    });
  }

  public async exec(
    message: Message,
    {
      code,
      depth,
      silent,
      async
    }: { code: string; depth: number; silent: any; async: any }
  ) {
    try {
      let hr = process.hrtime();
      let resulted = eval(async ? `(async () => {\n${code}\n})()` : code);
      if (isPromise(resulted)) resulted = await resulted;
      hr = process.hrtime(hr);

      const ctype = this.resolve(resulted);
      if (typeof resulted !== "string")
        resulted = require("util").inspect(resulted, {
          depth: depth || 0
        });

      if (silent) return;

      return message.util.send(
        new KyflxEmbed(message)
          .baseEmbed()
          .addField("Input", `\`\`\`js\n${code}\`\`\``)
          .addField("Output", `\`\`\`js\n${resulted.trunc(1000, true)}\`\`\``)
          .addField(
            "\u200b",
            `**Type**: \`\`\`ts\n${ctype}\`\`\`\n**Time**: ${
              hr[0] > 0 ? `${hr[0]}s ` : ""
            }${hr[1] / 1000000}ms`,
            true
          )
      );
    } catch (e) {
      this.logger.error(e, "eval");
      return message.util.send(
        new KyflxEmbed(message)
          .errorEmbed()
          .addField("Input", `\`\`\`js\n${code}\`\`\``)
          .addField("Error", `\`\`\`js\n${e.name}: ${e.message}\`\`\``)
      );
    }
  }

  private resolve(value: any) {
    const type = typeof value;
    switch (type) {
      case "object":
        return value === null
          ? "null"
          : value.constructor
          ? value.constructor.name
          : "any";
      case "function":
        return `${value.constructor.name}(${value.length}-arity)`;
      case "undefined":
        return "void";
      default:
        return type;
    }
  }
}
