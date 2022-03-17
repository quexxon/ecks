import { State } from "../types";
import XString from "./string";
import { TypedValue } from "../ast";
export default class XTemplateString {
    #private;
    kind: string;
    constructor(value: string, state: State);
    evaluate(state: State): XString;
    get __value(): string;
    get __length(): number;
    __eq(value: TypedValue): boolean;
    __lt(value: TypedValue): boolean;
    __gt(value: TypedValue): boolean;
    __toString(): string;
}
