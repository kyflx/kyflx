import { Event, EventOptions } from "klasa";
import { Init } from "../../../lib";

@Init<EventOptions>({ event: "ready" })
export default class ReadyListener extends Event {
  public async run() {
    await this.client.music.init(this.client.user.id);
  }
}
