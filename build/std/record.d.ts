import { TypedValue } from "../ast.js";
import { State } from "../types.js";
import XOptional from "./optional.js";
export default abstract class XRecord {
    kind: string;
    readonly __value: Map<string, TypedValue>;
    protected readonly __state: State;
    constructor(value: Map<string, TypedValue>, state: State);
    get(key: TypedValue): XOptional;
    get __name(): string;
    abstract __new(value: Map<string, TypedValue>): XRecord;
    __eq(value: TypedValue): boolean;
    __lt(value: TypedValue): boolean;
    __gt(value: TypedValue): boolean;
    __toString(): string;
}
