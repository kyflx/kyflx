import { Util } from "@kyflx-dev/util";
import { Message } from "discord.js";
import { Command, CommandOptions } from "klasa";
import { Init } from "../../../lib";

@Init<CommandOptions>({ permissionLevel: 9, usage: "<code:string>" })
export default class EvalCommand extends Command {
  public async run(
    message: Message,
    [ code ]: [ string ],
    { async, depth, silent } = message.flagArgs
  ) {
    try {
      let hr = process.hrtime();
      // tslint:disable-next-line: no-eval
      let resulted = eval(async ? `(async () => {\n${code}\n})()` : code);
      if (Util.isPromise(resulted)) resulted = await resulted;
      hr = process.hrtime(hr);

      const ctype = this.resolve(resulted);
      if (typeof resulted !== "string") {
        resulted = require("util").inspect(resulted, {
          depth: depth || 0,
        });
      }

      if (silent) return;

      return message.send(
        this.client.embed(message)
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
      message.send(
        this.client.embed(message)
          .setColor("RED")
          .addField("Input", `\`\`\`js\n${code}\`\`\``)
          .addField("Error", `\`\`\`js\n${e.name}: ${e.message}\`\`\``)
      );
      throw e;
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
