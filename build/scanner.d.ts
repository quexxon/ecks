import Token from "./token.js";
import { State } from "./types.js";
export default class Scanner {
    #private;
    constructor(source: string, state: State);
    scan(): Token[];
}
