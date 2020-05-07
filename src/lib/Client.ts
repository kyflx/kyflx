import { APIWrapperStore, Config } from "@kyflx-dev/util";
import { MessageEmbed, Message } from "discord.js";
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
    (global as any).config = Config.getInstance();
    return this;
  }

  public embed(message: Message): MessageEmbed {
    return new MessageEmbed()
      .setColor("BLURPLE")
      .setAuthor(message.author.username, message.author.displayAvatarURL(), this.invite);
  }
}
