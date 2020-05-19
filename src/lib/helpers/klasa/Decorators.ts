import { Piece, PieceOptions } from "klasa";
import { CommandOptions } from "klasa";

const BuildDecorator = (options: any) => {
  return function <T extends new (...args: any[]) => Piece>(constructor: T) {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args, options);
      }
    };
  };
};

export function Init<O extends PieceOptions>(options: O) {
  return BuildDecorator(options);
}

export function GuildCommand(options: CommandOptions = {}) {
  return BuildDecorator({ ...options, runIn: ["text"] });
}

export function DJCommand(options: CommandOptions = {}) {
  return BuildDecorator({
    ...options,
    runIn: ["text"],
    permissionLevel: 5,
  })
}

export function OwnerCommand(options: CommandOptions = {}) {
  return BuildDecorator({
    ...options,
    permissionLevel: 10
  })
}
