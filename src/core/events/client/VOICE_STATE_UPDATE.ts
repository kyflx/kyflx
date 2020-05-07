import { Event, EventOptions } from "klasa";
import { VoiceState } from "lavaclient";
import { Init } from "../../../lib";

@Init<EventOptions>({ emitter: "ws" })
export default class VoiceStateUpdate extends Event {
  public async run(state: VoiceState) {
    await this.client.music.stateUpdate(state);
  }
}