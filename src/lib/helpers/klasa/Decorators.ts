import { Piece, PieceOptions } from "klasa";

export function Init<O extends PieceOptions>(options: O) {
  return function <T extends new (...args: any[]) => Piece>(constructor: T) {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args, options);
      }
    };
  };
}
