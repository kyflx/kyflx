import { Event, Finalizer } from "klasa";

export default class FinalizerErrorEvent extends Event {
  public run(
    _m: any,
    _c: any,
    _r: any,
    _t: any,
    finalizer: Finalizer,
    error: Error
  ) {
    return this.client.logger.error({
      prefix: `event (${finalizer.name})`,
      message: error,
    });
  }
}
