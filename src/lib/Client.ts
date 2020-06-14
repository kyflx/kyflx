import { APIWrapperStore, Config } from "@kyflx-dev/util";
import { Message, MessageEmbed } from "discord.js";
import { KlasaClient } from "klasa";

import { Wrappers } from "../core";
import { MusicHelper } from "./helpers";

export class Kyflx extends KlasaClient {
  public apis: APIWrapperStore<Wrappers>;
  public music = new MusicHelper(this);

  public registerStores(): KlasaClient {
    return super
      .registerStores()
      .registerStore((this.apis = new APIWrapperStore(this)));
  }

  public init() {
    let g = global as any;
    g.config = Config.getInstance();
    g.when = (q: string, o: Record<string, Function>): any =>
      o[q.toLowerCase()] ? o[q.toLowerCase()]() : void 0;
    return this;
  }

  public embed(message: Message): MessageEmbed {
    return new MessageEmbed()
      .setColor("#7289DA")
      .setAuthor(message.author.username, message.author.displayAvatarURL(), this.invite);
  }
}
