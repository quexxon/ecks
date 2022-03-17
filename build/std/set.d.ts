import { TypedValue } from "../ast.js";
import { State } from "../types.js";
import XBoolean from "./boolean.js";
import XInteger from "./integer.js";
export default class XSet {
    #private;
    kind: string;
    constructor(value: TypedValue[], state: State);
    has(value: TypedValue): XBoolean;
    len(): XInteger;
    union(value: TypedValue): XSet;
    get __value(): Map<string, TypedValue>;
    get __length(): number;
    __new(value: TypedValue[]): XSet;
    __eq(value: TypedValue): boolean;
    __lt(value: TypedValue): boolean;
    __gt(value: TypedValue): boolean;
    __toString(): string;
}
