import { Event, EventOptions } from "klasa";
import { Init } from "../../../lib";

@Init<EventOptions>({ emitter: process })
export default class extends Event {
  public run(err: Error) {
    if (!err) return;
    this.client.logger.error(err);
  }
}
