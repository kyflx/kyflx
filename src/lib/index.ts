import { APIWrapperOptions, APIWrapperStore } from "@kyflx-dev/util";
import { Message, MessageEmbed } from "discord.js";
import { Wrappers } from "../core";
import { MusicHelper, Queue, REST } from "./helpers";
import { FilterMap } from "../types";

export * from "./Client";
export * from "./helpers";
export * from "./util";

declare module "lavaclient" {
  interface Player {
    queue: Queue;
    bass: string;

    filter<K extends keyof FilterMap>(name: K, data: FilterMap[K], merge?: boolean): Promise<boolean>;
  }

  interface Socket {
    rest: REST;
  }
}

declare module "klasa" {
  interface KlasaClient {
    music: MusicHelper;
    apis: APIWrapperStore<Wrappers>;

    embed(message: Message): MessageEmbed;
  }

  interface GatewayDriver {
    infractions: Gateway;
  }

  interface PieceDefaults {
    apis: APIWrapperOptions;
  }
}
