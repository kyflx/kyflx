import { Event, Monitor } from "klasa";

export default class EventErrorEvent extends Event {
  public run(_m: any, monitor: Monitor, error: Error) {
    return this.client.logger.error({
      prefix: `monitor (${monitor.name})`,
      message: error,
    });
  }
}
