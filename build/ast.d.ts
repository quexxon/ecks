import XArray from "./std/array.js";
import XBoolean from "./std/boolean.js";
import XFloat from "./std/float.js";
import XInteger from "./std/integer.js";
import XLambda from "./std/lambda.js";
import XMap from "./std/map.js";
import XOptional from "./std/optional.js";
import XRecord from "./std/record.js";
import { XDate } from "./std/date.js";
import XSet from "./std/set.js";
import XString from "./std/string.js";
import XTemplateString from "./std/templateString.js";
import XTuple from "./std/tuple.js";
import Token from "./token.js";
import { State } from "./types.js";
export declare enum UnaryOperator {
    Negation = "-",
    Not = "!"
}
export declare enum BinaryOperator {
    Addition = "+",
    Subtraction = "-",
    Multiplication = "*",
    Division = "/",
    Modulo = "%",
    Exponent = "^",
    Equal = "=",
    NotEqual = "!=",
    LessThan = "<",
    LessThanOrEqual = "<=",
    GreaterThan = ">",
    GreaterThanOrEqual = ">=",
    Or = "or",
    And = "and",
    Optional = "??"
}
export declare function tokenToUnaryOperator(token: Token): UnaryOperator;
export declare function tokenToBinaryOperator(token: Token): BinaryOperator;
export declare type TypedValue = XInteger | XFloat | XBoolean | XString | XTemplateString | XArray | XDate | XSet | XTuple | XMap | XLambda | XOptional | XRecord;
export interface Primitive {
    kind: "primitive";
    value: TypedValue;
    offset: number;
}
export interface Unary {
    kind: "unary";
    operator: UnaryOperator;
    operand: Expression;
    offset: number;
}
export interface Binary {
    kind: "binary";
    operator: BinaryOperator;
    left: Expression;
    right: Expression;
    offset: number;
}
export interface Ternary {
    kind: "ternary";
    antecedent: Expression;
    consequent: Expression;
    alternative: Expression;
}
export interface Cond {
    kind: "cond";
    branches: Array<[Expression, Expression]>;
    else?: Expression;
}
export interface Case {
    kind: "case";
    target: Expression;
    branches: Array<[Expression, Expression]>;
    else?: Expression;
}
export interface Let {
    kind: "let";
    bindings: Array<[Identifier, Expression]>;
    body: Expression;
}
export interface Grouping {
    kind: "grouping";
    expression: Expression;
    offset: number;
}
export interface ArrayGroup {
    kind: "array";
    elements: Expression[];
    offset: number;
}
export interface SetGroup {
    kind: "set";
    elements: Expression[];
    offset: number;
}
export interface TupleGroup {
    kind: "tuple";
    elements: Expression[];
    offset: number;
}
export interface MapGroup {
    kind: "map";
    elements: Array<[Expression, Expression]>;
    offset: number;
}
export interface RecordGroup {
    kind: "record";
    name: string;
    members: Array<[Identifier, Expression]>;
    offset: number;
}
export interface MethodCall {
    kind: "method-call";
    receiver: Expression;
    identifier: Identifier;
    arguments: Expression[];
    offset: number;
}
export interface Index {
    kind: "index";
    receiver: Expression;
    index: Expression;
    offset: number;
}
export interface Optional {
    kind: "optional";
    value?: Expression;
    offset: number;
}
export interface Identifier {
    kind: "identifier";
    name: string;
    offset: number;
}
export interface Lambda {
    kind: "lambda";
    parameters: Identifier[];
    body: Expression;
    offset: number;
}
export declare type Expression = Unary | Binary | Ternary | Cond | Case | Let | Primitive | Grouping | ArrayGroup | SetGroup | TupleGroup | MapGroup | RecordGroup | MethodCall | Index | Lambda | Optional | Identifier;
export declare function unary(token: Token, operand: Expression): Unary;
export declare function binary(left: Expression, token: Token, right: Expression): Binary;
export declare function ternary(antecedent: Expression, consequent: Expression, alternative: Expression): Ternary;
export declare function cond(branches: Array<[Expression, Expression]>, alternative?: Expression): Cond;
export declare function case_(target: Expression, branches: Array<[Expression, Expression]>, alternative?: Expression): Case;
export declare function let_(bindings: Array<[Identifier, Expression]>, body: Expression): Let;
export declare function boolean(token: Token, state: State): Primitive;
export declare function integer(token: Token, state: State): Primitive;
export declare function float(token: Token, state: State): Primitive;
export declare function string(token: Token, state: State): Primitive;
export declare function templateString(token: Token, state: State): Primitive;
export declare function grouping(expression: Expression, offset: number): Grouping;
export declare function array(elements: Expression[], offset: number): ArrayGroup;
export declare function set(elements: Expression[], offset: number): SetGroup;
export declare function tuple(elements: Expression[], offset: number): TupleGroup;
export declare function map(elements: Array<[Expression, Expression]>, offset: number): MapGroup;
export declare function record(token: Token, members: Array<[Identifier, Expression]>): RecordGroup;
export declare function optional(offset: number, value?: Expression): Optional;
export declare function identifier(token: Token): Identifier;
export declare function methodCall(receiver: Expression, token: Token, args: Expression[], offset: number): MethodCall;
export declare function index(receiver: Expression, index: Expression, offset: number): Index;
export declare function lambda(parameters: Identifier[], body: Expression, offset: number): Lambda;
export declare function toString(expr: Expression): string;
