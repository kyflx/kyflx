import { Event, EventOptions } from "klasa";
import { Init } from "../../../lib";

@Init<EventOptions>({ emitter: "music" })
export default class LavaclientErrorEvent extends Event {
  public async run(error: Error, node: string) {
    return this.logger.fatal(node ? { prefix: `lavalink: ${node}`, message: error.message } : error.message);
  }
}
