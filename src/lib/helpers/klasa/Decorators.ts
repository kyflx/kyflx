import { Piece, PieceOptions } from "klasa";
import { CommandOptions } from "klasa";

export function Init<O extends PieceOptions>(options: O) {
  return function <T extends new (...args: any[]) => Piece>(constructor: T) {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args, options);
      }
    };
  };
}

export function GuildCommand(options: CommandOptions = {}) {
  return function <T extends new (...args: any[]) => Piece>(constructor: T) {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args, {
          ...options,
          runIn: ["text"],
        } as CommandOptions);
      }
    };
  };
}

export function DJCommand(options: CommandOptions = {}) {
  return function <T extends new (...args: any[]) => Piece>(constructor: T) {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args, {
          ...options,
          runIn: ["text"],
          permissionLevel:  5
        } as CommandOptions);
      }
    };
  };
}
