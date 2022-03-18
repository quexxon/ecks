import { TypedValue } from "./ast.js";
import XRecord from "./std/record.js";
export interface MethodType {
    arguments: PrimitiveType[];
    call(...args: any[]): any;
}
export interface LambdaType {
    kind: "lambda";
}
export interface IntegerType {
    kind: "integer";
}
export interface FloatType {
    kind: "float";
}
export declare type PrimitiveType = IntegerType | FloatType | LambdaType;
export declare const Type: Record<string, PrimitiveType>;
export interface State {
    environment: Environment;
    records: Records;
}
export declare type Environment = Map<string, TypedValue>;
export declare type Records = Map<string, new (value: Map<string, TypedValue>, state: State) => XRecord>;
