import { Message } from "discord.js";
import { Argument, Possible, Duration } from "klasa";

const DURATION_REGEX = /^(\d+):([0-5]?[0-9]|59)$/;
const PARSE_REGEX = /(-?\d*\.?\d+(?:e[-+]?\d+)?)\s*([a-zμ]*)/gi;
const COMMAS_REGEX = /,/g;
const A_AN_REGEX = /\ban?\b/gi;
const tokens = new Map([
  ["nanosecond", 1 / 1e6],
  ["nanoseconds", 1 / 1e6],
  ["ns", 1 / 1e6],

  ["millisecond", 1],
  ["milliseconds", 1],
  ["ms", 1],

  ["second", 1000],
  ["seconds", 1000],
  ["sec", 1000],
  ["secs", 1000],
  ["s", 1000],

  ["minute", 1000 * 60],
  ["minutes", 1000 * 60],
  ["min", 1000 * 60],
  ["mins", 1000 * 60],
  ["m", 1000 * 60],

  ["hour", 1000 * 60 * 60],
  ["hours", 1000 * 60 * 60],
  ["hr", 1000 * 60 * 60],
  ["hrs", 1000 * 60 * 60],
  ["h", 1000 * 60 * 60],

  ["day", 1000 * 60 * 60 * 24],
  ["days", 1000 * 60 * 60 * 24],
  ["d", 1000 * 60 * 60 * 24],

  ["week", 1000 * 60 * 60 * 24 * 7],
  ["weeks", 1000 * 60 * 60 * 24 * 7],
  ["wk", 1000 * 60 * 60 * 24 * 7],
  ["wks", 1000 * 60 * 60 * 24 * 7],
  ["w", 1000 * 60 * 60 * 24 * 7],

  ["month", 1000 * 60 * 60 * 24 * (365.25 / 12)],
  ["months", 1000 * 60 * 60 * 24 * (365.25 / 12)],
  ["b", 1000 * 60 * 60 * 24 * (365.25 / 12)],

  ["year", 1000 * 60 * 60 * 24 * 365.25],
  ["years", 1000 * 60 * 60 * 24 * 365.25],
  ["yr", 1000 * 60 * 60 * 24 * 365.25],
  ["yrs", 1000 * 60 * 60 * 24 * 365.25],
  ["y", 1000 * 60 * 60 * 24 * 365.25],
]);

export default class MSArgument extends Argument {
  public async run(arg: string, _p: Possible, message: Message) {
    const parsed = this._parse(arg);

    if (!parsed) {
      if (!PARSE_REGEX.test(arg))
        throw message.t("RESOLVER_INVALID_MS_DURATION", _p.name);

      const [, _m, _] = DURATION_REGEX.exec(arg),
        [m, s] = [parseInt(_m), parseInt(_)];

      return this._parse(`${m}m${s ? ` ${s}s` : ""}`);
    }

    return parsed;
  }

  public _parse(pattern: string) {
    let result = 0;
    pattern
      // ignore commas
      .replace(COMMAS_REGEX, "")
      // a / an = 1
      .replace(A_AN_REGEX, "1")
      // do math
      .replace(PARSE_REGEX, (match, i, units) => {
        units = tokens.get(units) || 0;
        result += Number(i) * units;
        return "";
      });

    return result;
  }
}
