export interface HookMethod {
  event: string;
  listener: Function;
}

export const HookDecorator = Symbol("HookDecorator");

/**
 * Gets all the "listeners" for the given hook.
 * @param target The desired hook.
 */
export function getAllListeners(target: any): HookMethod[] {
  if (target.constructor == null) return [];

  const methods = target.constructor[HookDecorator];
  if (!Array.isArray(methods)) return [];
  return methods;
}

/**
 * Adds a listener entry for Hook#_listen.
 * @param {string} event - The event to listen for.
 * @returns {MethodDecorator}
 */
export function listen(event: string): MethodDecorator {
  return function(
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    if (target.prototype !== undefined)
      throw new Error(
        `"${target.name}#${String(
          propertyKey
        )}": Listen can only be applied to non-static methods`
      );

    if (!target.constructor[HookDecorator]) {
      Object.defineProperty(target.constructor, HookDecorator, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: []
      });
    }

    target.constructor[HookDecorator].push({
      event,
      listener: descriptor.value
    });
  };
}

/**
 * A class that helps with events and such.
 * @since 1.0.0
 */
export default class EmitterHook {
  /**
   * The emitter that this hook is meant for.
   */
  readonly emitter!: NodeJS.EventEmitter;

  /**
   * Creates a new Emitter Hook.
   * @param {NodeJS.EventEmitter} emitter The emitter that this hook is created for.
   */
  public constructor(emitter: NodeJS.EventEmitter) {
    Object.defineProperty(this, "emitter", { value: emitter });
    this._listen();
  }

  /**
   * Adds listeners to the emitter.
   * @private
   */
  private _listen() {
    const methods = getAllListeners(this);
    for (const method of methods) {
      if (!this.emitter.listenerCount(method.event)) {
        this.emitter.addListener(method.event, method.listener.bind(this));
      }
    }
  }
}
