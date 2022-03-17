import { State } from "./types.js";
import { TypedValue } from "./ast.js";
export declare const render: (source: string, state?: State) => TypedValue;
export declare const fromJs: (value: any, state?: State) => TypedValue;
export declare const toJs: (value: TypedValue) => any;
