import { Message } from "discord.js";
import { Command } from "klasa";
import { r } from "rethinkdb-ts";

export default class PingCommand extends Command {
  // @ts-ignore
  public async run(message: Message) {
    const now = Date.now();
    const dbping = (await r.now().run()).getTime() - now;

    return message
      .reply(message.t("util.ping.to-edit", dbping))
      .then((m) =>
        m.edit(
          message.t(
            "util.ping.res",
            dbping,
            m.createdTimestamp - message.createdTimestamp
          )
        )
      );
  }
}
