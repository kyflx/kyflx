import { EventEmitter } from "events";
import VorteClient from "../Client";

const SUBSCRIBED_EVENTS_SYMBOL = Symbol("SubscribedEvents");

interface SubscribedEvent {
  listener: Function;
  event: string;
  emitter: string;
  type: "on" | "once" | "off";
}

export default abstract class Plugin {
  public abstract name: string;
  public client: VorteClient;

  public constructor(client: VorteClient) {
    this.client = client;
  }

  public get emitters(): Record<string, EventEmitter> {
    return {
      client: this.client,
      commands: this.client.commands,
      events: this.client.events,
      process,
      music: this.client.music
    };
  }

  public onLoad(): any {}

  public onReady(): any {
    this._listen();
  }

  private _listen(): void {
    const methods = getAllListeners(this);
    for (const method of methods)
      if (!this.emitters[method.emitter].listenerCount(method.event))
        this.emitters[method.emitter][method.type](
          method.event,
          method.listener.bind(this)
        );
  }
}

function getAllListeners(target: any): SubscribedEvent[] {
  if (target.constructor == null) return [];
  const methods = target.constructor[SUBSCRIBED_EVENTS_SYMBOL];
  if (!Array.isArray(methods)) return [];
  return methods;
}

export function Subscribe(
  event: string,
  {
    emitter = "client",
    type = "on"
  }: { emitter?: string; type?: "on" | "once" | "off" } = {}
) {
  return function(
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    if (target.prototype !== undefined)
      throw new Error(
        `"${target.name}#${String(
          propertyKey
        )}": Subscribe can only be applied to non-static methods`
      );

    if (!target.constructor[SUBSCRIBED_EVENTS_SYMBOL])
      Object.defineProperty(target.constructor, SUBSCRIBED_EVENTS_SYMBOL, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: []
      });

    target.constructor[SUBSCRIBED_EVENTS_SYMBOL].push({
      event,
      listener: descriptor.value,
      emitter,
      type
    });
  };
}
