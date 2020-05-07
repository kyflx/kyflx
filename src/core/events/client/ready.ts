import { Event } from "klasa";
import { Init } from "../../../lib";
import { EventOptions } from "klasa";

@Init<EventOptions>({ event: "ready" })
export default class ReadyListener extends Event {
  public async run() {
    await this.client.music.init(this.client.user.id);
  }
}
