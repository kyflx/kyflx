import express from "express";
import { AkairoClient } from "discord-akairo";
import { RequestHandler } from "express-serve-static-core";
import WebServer from "../../web/server";

export enum RESTMethod {
  GET = "get",
  POST = "post",
  USE = "use",
  PUT = "put",
  PATCH = "patch",
  DELETE = "delete"
}

export type MethodShit = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => Promise<void>;

export type Handlers = RequestHandler[];

export const REST_COMPONENT_SYMBOL = Symbol("RESTComponent");

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

/**
 * Apply's a rest decorator the given target.
 * @param method - The request method.
 * @param path - The path of the endpoint
 * @param target - The targeted class method
 * @param propertyKey - The name of the method
 * @param descriptor - Property descriptor
 * @param handlers - The provided request handlers
 */
export function applyDecorator(
  method: RESTMethod,
  path: string,
  target: any,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<any>,
  handlers: Handlers
) {
  if (target.prototype !== undefined) {
    throw new Error(
      `Decorators can only be applied to non-static class properties ("${String(
        propertyKey
      )}" in class "${target.name}")`
    );
  }

  if (!target.constructor[REST_COMPONENT_SYMBOL]) {
    target.constructor[REST_COMPONENT_SYMBOL] = {
      name: null,
      routes: []
    };
  }

  target.constructor[REST_COMPONENT_SYMBOL].routes.push({
    method,
    path,
    fn: descriptor.value,
    handlers
  } as IRESTDecoratorDefinition);
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
      RESTMethod.POST,
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
      RESTMethod.PUT,
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
      RESTMethod.PATCH,
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
      RESTMethod.DELETE,
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

/**
 * Acts as a Rest Route.
 */
export class APIRouter {
  public server!: WebServer;
  public router: express.Router = express.Router();

  public constructor(public client: AkairoClient) {}
}
