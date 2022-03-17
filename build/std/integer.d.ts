import { TypedValue } from "../ast.js";
import { State } from "../types.js";
import XFloat from "./float.js";
import XString from "./string.js";
export default class XInteger {
    #private;
    kind: string;
    constructor(value: number, state: State);
    float(): XFloat;
    str(): XString;
    abs(): XInteger;
    clamp(x: XInteger | XFloat, y: XInteger | XFloat): XInteger;
    sqrt(): XFloat;
    pow(exp: XInteger | XFloat): XFloat;
    get __value(): number;
    __new(value: number): XInteger;
    __eq(value: TypedValue): boolean;
    __lt(value: TypedValue): boolean;
    __gt(value: TypedValue): boolean;
    __toString(): string;
}
