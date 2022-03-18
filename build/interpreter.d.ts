import { Expression, TypedValue } from "./ast.js";
import { State } from "./types.js";
export default class Interpreter {
    #private;
    constructor(expression: Expression, state: State);
    render(): TypedValue;
}
