import { Util } from "@kyflx-dev/util";

export class Result<T> {
  public result: T = null;
  public error: any;

  static provide<T>(result: T): Result<T> {
    return new Result<T>().set(result);
  }

  public set(result: any): Result<T> {
    Util.isPromise(result)
      ? result.then((r: T) => (this.result = r))
      : (this.result = result);
    return this;
  }

  public setError(error: any): Result<T> {
    this.error = error;
    return this;
  }
}
