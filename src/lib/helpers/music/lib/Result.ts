import { Util } from "@kyflx-dev/util";

export class Result<T> {
  public result: T = null;

  public set(result: any): Result<T> {
    Util.isPromise(result)
      ? result.then((r: T) => (this.result = r))
      : (this.result = result);
    return this;
  }

  static provide<T>(result: T): Result<T> {
    return new Result<T>().set(result);
  }
}
