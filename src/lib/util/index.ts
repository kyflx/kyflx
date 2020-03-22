export { default as Config } from "./Config";
export * from "./Constants";
export * from "./functions";

String.prototype.capitalize = function() {
  return this.slice(0, 1).toUpperCase() + this.slice(1).toLowerCase();
};

String.prototype.trunc = function(n: number, useWordBoundary: boolean) {
  if (this.length <= n) {
    return this;
  }

  const subString = this.substr(0, n - 1);
  return (
    (useWordBoundary
      ? subString.substr(0, subString.lastIndexOf(" "))
      : subString) + "..."
  );
};

String.prototype.ignoreCase = function(value: string): boolean {
  return this.toLowerCase() === value.toLowerCase();
};

(global as any).when = (q: string, o: Record<string, Function>): any =>
  o[q.toLowerCase()] ? o[q.toLowerCase()]() : o.else ? o.else() : void 0;
