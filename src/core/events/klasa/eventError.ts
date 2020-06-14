import { Event } from "klasa";

export default class EventErrorEvent extends Event {
  public run(event: Event, _a: any, error: Error) {
    return this.client.logger.error({ prefix: `event (${event.name})`, message: error });
  }
}
