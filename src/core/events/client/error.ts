import { Event } from "klasa";

export default class ErrorEvent extends Event {
  public run(error: Error) {
    return this.client.logger.fatal(error);
  }
}