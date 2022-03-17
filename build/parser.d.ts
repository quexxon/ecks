import Token from "./token.js";
import { Expression } from "./ast.js";
import { State } from "./types.js";
export default class Parser {
    #private;
    constructor(tokens: Token[], state: State);
    parse(): Expression;
}
