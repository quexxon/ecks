import { TypedValue } from "../ast.js";
import { State } from "../types.js";
export default class XOptional {
    #private;
    kind: string;
    constructor(state: State, value?: TypedValue);
    map(fn: TypedValue): XOptional;
    get __value(): TypedValue | undefined;
    __new(value?: TypedValue): XOptional;
    __eq(value: TypedValue): boolean;
    __lt(value: TypedValue): boolean;
    __gt(value: TypedValue): boolean;
    __toString(): string;
}
