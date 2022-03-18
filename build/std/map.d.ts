import { TypedValue } from "../ast.js";
import { State } from "../types.js";
import XInteger from "./integer.js";
import XOptional from "./optional.js";
export default class XMap {
    #private;
    kind: string;
    readonly __keyType?: string;
    readonly __valType?: string;
    constructor(value: Array<[TypedValue, TypedValue]>, state: State);
    len(): XInteger;
    get(key: TypedValue): XOptional;
    del(key: TypedValue): XMap;
    set(key: TypedValue, value: TypedValue): XMap;
    get __value(): Map<string, TypedValue>;
    get __length(): number;
    get __keys(): Map<string, TypedValue>;
    __new(value: Array<[TypedValue, TypedValue]>): XMap;
    __eq(value: TypedValue): boolean;
    __lt(value: TypedValue): boolean;
    __gt(value: TypedValue): boolean;
    __toString(): string;
}
