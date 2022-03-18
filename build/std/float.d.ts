import { TypedValue } from "../ast.js";
import { State } from "../types.js";
import XInteger from "./integer.js";
import XString from "./string.js";
export default class XFloat {
    #private;
    kind: string;
    constructor(value: number, state: State);
    abs(): XFloat;
    int(): XInteger;
    ceil(): XFloat;
    floor(): XFloat;
    rnd(): XFloat;
    ceili(): XInteger;
    floori(): XInteger;
    rndi(): XInteger;
    sqrt(): XFloat;
    clamp(x: XInteger | XFloat, y: XInteger | XFloat): XFloat;
    str(): XString;
    get __value(): number;
    __new(value: number): XFloat;
    __eq(value: TypedValue): boolean;
    __lt(value: TypedValue): boolean;
    __gt(value: TypedValue): boolean;
    __toString(): string;
}
