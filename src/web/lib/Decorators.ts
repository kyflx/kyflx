import {
  applyDecorator,
  Handlers,
  MethodShit,
  REST_COMPONENT_SYMBOL,
	RESTMethod
} from "./";

export interface IRESTDecoratorDefinition {
  method: RESTMethod;
  path: string;
  fn: MethodShit;
  handlers: Handlers;
}

export interface IRouteObject {
  name: string;
  routes: IRESTDecoratorDefinition[];
}

export function getRouteObject(target: any): IRouteObject | undefined {
  if (
    target.constructor == null ||
    !target.constructor[REST_COMPONENT_SYMBOL].name
  )
    return;
  if (!target.constructor[REST_COMPONENT_SYMBOL]) return;

  return target.constructor[REST_COMPONENT_SYMBOL];
}

/**
 * Creates a new GET endpoint on the router.
 * @param path - endpoint path.
 * @param handlers - request handlers to use.
 */
export function Get(
  path: string = "/",
  ...handlers: Handlers
): MethodDecorator {
  return function(
    target: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    applyDecorator(
      RESTMethod.GET,
      path,
      target,
      propertyKey,
      descriptor,
      handlers
    );
  };
}

/**
 * Creates a new POST endpoint on the router.
 * @param path - endpoint path.
 * @param handlers - request handlers to use.
 */
export function Post(
  path: string = "/",
  ...handlers: Handlers
): MethodDecorator {
  return function(
    target: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    applyDecorator(
      RESTMethod.GET,
      path,
      target,
      propertyKey,
      descriptor,
      handlers
    );
  };
}

/**
 * Creates a new PUT endpoint on the router.
 * @param path - endpoint path.
 * @param handlers - request handlers to use.
 */
export function Put(
  path: string = "/",
  ...handlers: Handlers
): MethodDecorator {
  return function(
    target: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    applyDecorator(
      RESTMethod.GET,
      path,
      target,
      propertyKey,
      descriptor,
      handlers
    );
  };
}

/**
 * Creates a new PATCH endpoint on the router.
 * @param path - endpoint path.
 * @param handlers - request handlers to use.
 */
export function Patch(
  path: string = "/",
  ...handlers: Handlers
): MethodDecorator {
  return function(
    target: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    applyDecorator(
      RESTMethod.GET,
      path,
      target,
      propertyKey,
      descriptor,
      handlers
    );
  };
}

export function Delete(
  path: string = "/",
  ...handlers: Handlers
): MethodDecorator {
  return function(
    target: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    applyDecorator(
      RESTMethod.GET,
      path,
      target,
      propertyKey,
      descriptor,
      handlers
    );
  };
}

export function Router(name: string = "/"): ClassDecorator {
  return function(target: any) {
    target[REST_COMPONENT_SYMBOL].name = name;
  };
}

export function Use(path?: string): MethodDecorator {
  return function(
    target: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    applyDecorator(
      RESTMethod.USE,
      path || "",
      target,
      propertyKey,
      descriptor,
      []
    );
  };
}
