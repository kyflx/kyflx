import express from "express";
import { RequestHandler } from "express-serve-static-core";
import { IRESTDecoratorDefinition } from "./Decorators";

export * from "./Decorators";
export * from "./Route";

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
