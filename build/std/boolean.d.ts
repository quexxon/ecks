import { TypedValue } from "../ast.js";
import { State } from "../types.js";
import XString from "./string.js";
export default class XBoolean {
    #private;
    kind: string;
    constructor(value: boolean, state: State);
    str(): XString;
    get __value(): boolean;
    __new(value: boolean): XBoolean;
    __eq(value: TypedValue): boolean;
    __lt(value: TypedValue): boolean;
    __gt(value: TypedValue): boolean;
    __toString(): string;
}
