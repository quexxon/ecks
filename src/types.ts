import { TypedValue } from "./ast.js";
import XRecord from "./std/record.js";

export interface MethodType {
    arguments: PrimitiveType[];
    call(...args: any[]): any; // eslint-disable-line @typescript-eslint/no-explicit-any
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

export type PrimitiveType = IntegerType | FloatType | LambdaType;

export const Type: Record<string, PrimitiveType> = {
    integer: { kind: "integer" },
    float: { kind: "float" }
};

export interface State {
    environment: Environment;
    records: Records;
}

export type Environment = Map<string, TypedValue>;

export type Records = Map<
    string,
    new (value: Map<string, TypedValue>, state: State) => XRecord
>;
