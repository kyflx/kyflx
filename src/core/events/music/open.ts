import { Event, EventOptions } from "klasa";
import { Init } from "../../../lib";

@Init<EventOptions>({ event: "open", emitter: "music" })
export default class OpenListener extends Event {
  public run(node: string) {
    this.client.logger.success(`Lavalink Socket: ${node} is now connected`);
  }
}
