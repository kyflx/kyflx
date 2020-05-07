import { Event } from "klasa";

export default class WarnEvent extends Event {
  public run(warning: any) {
    return this.client.logger.warn(warning);
  }
}