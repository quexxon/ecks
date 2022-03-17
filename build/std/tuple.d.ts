import { TypedValue } from "../ast.js";
import { State } from "../types.js";
import XInteger from "./integer.js";
export default class XTuple {
    #private;
    kind: string;
    constructor(value: TypedValue[], state: State);
    at(index: TypedValue): TypedValue;
    len(): XInteger;
    get __value(): TypedValue[];
    get __length(): number;
    __new(value: TypedValue[]): XTuple;
    __eq(value: TypedValue): boolean;
    __lt(value: TypedValue): boolean;
    __gt(value: TypedValue): boolean;
    __toString(): string;
}
