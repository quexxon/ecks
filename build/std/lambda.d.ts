import { Expression, Identifier, TypedValue } from "../ast.js";
import { State } from "../types.js";
import XArray from "./array.js";
interface Lambda {
    params: Identifier[];
    body: Expression;
}
export default class XLambda {
    #private;
    kind: string;
    constructor(value: Lambda, state: State);
    apply(args: XArray): TypedValue;
    call(...args: TypedValue[]): TypedValue;
    get __value(): Lambda;
    __eq(value: TypedValue): boolean;
    __lt(value: TypedValue): boolean;
    __gt(value: TypedValue): boolean;
    __toString(): string;
}
export {};
