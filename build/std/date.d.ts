import { TypedValue } from "../ast.js";
import { State } from "../types.js";
export declare class XDate {
    #private;
    kind: string;
    constructor(value: Date, state: State);
    __new(value: Date, state: State): XDate;
    __state(): State;
    __eq(): boolean;
    __lt(value: TypedValue): boolean;
    __gt(value: TypedValue): boolean;
    get __value(): Date;
    __toString(): string;
}
