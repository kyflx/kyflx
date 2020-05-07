import { Event, EventOptions } from "klasa";
import { VoiceServer } from "lavaclient";
import { Init } from "../../../lib";

@Init<EventOptions>({ emitter: "ws" })
export default class VoiceStateUpdate extends Event {
  public async run(state: VoiceServer) {
    await this.client.music.serverUpdate(state);
  }
}