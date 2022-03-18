import XBoolean from "./std/boolean.js";
import XFloat from "./std/float.js";
import XInteger from "./std/integer.js";
import XString from "./std/string.js";
import XTemplateString from "./std/templateString.js";
import { TokenKind } from "./token.js";
export var UnaryOperator;
(function (UnaryOperator) {
    UnaryOperator["Negation"] = "-";
    UnaryOperator["Not"] = "!";
})(UnaryOperator || (UnaryOperator = {}));
export var BinaryOperator;
(function (BinaryOperator) {
    BinaryOperator["Addition"] = "+";
    BinaryOperator["Subtraction"] = "-";
    BinaryOperator["Multiplication"] = "*";
    BinaryOperator["Division"] = "/";
    BinaryOperator["Modulo"] = "%";
    BinaryOperator["Exponent"] = "^";
    BinaryOperator["Equal"] = "=";
    BinaryOperator["NotEqual"] = "!=";
    BinaryOperator["LessThan"] = "<";
    BinaryOperator["LessThanOrEqual"] = "<=";
    BinaryOperator["GreaterThan"] = ">";
    BinaryOperator["GreaterThanOrEqual"] = ">=";
    BinaryOperator["Or"] = "or";
    BinaryOperator["And"] = "and";
    BinaryOperator["Optional"] = "??";
})(BinaryOperator || (BinaryOperator = {}));
const TOKEN_TO_UNARY_OP = new Map([
    [TokenKind.Minus, UnaryOperator.Negation],
    [TokenKind.Bang, UnaryOperator.Not]
]);
const TOKEN_TO_BINARY_OP = new Map([
    [TokenKind.Plus, BinaryOperator.Addition],
    [TokenKind.Minus, BinaryOperator.Subtraction],
    [TokenKind.Star, BinaryOperator.Multiplication],
    [TokenKind.Slash, BinaryOperator.Division],
    [TokenKind.Percent, BinaryOperator.Modulo],
    [TokenKind.Caret, BinaryOperator.Exponent],
    [TokenKind.Equal, BinaryOperator.Equal],
    [TokenKind.BangEqual, BinaryOperator.NotEqual],
    [TokenKind.Less, BinaryOperator.LessThan],
    [TokenKind.LessEqual, BinaryOperator.LessThanOrEqual],
    [TokenKind.Greater, BinaryOperator.GreaterThan],
    [TokenKind.GreaterEqual, BinaryOperator.GreaterThanOrEqual],
    [TokenKind.Or, BinaryOperator.Or],
    [TokenKind.And, BinaryOperator.And],
    [TokenKind.DoubleQuestion, BinaryOperator.Optional]
]);
export function tokenToUnaryOperator(token) {
    const operator = TOKEN_TO_UNARY_OP.get(token.kind);
    if (operator === undefined) {
        throw new Error(`Token is not an operator: ${TokenKind[token.kind]}`);
    }
    return operator;
}
export function tokenToBinaryOperator(token) {
    const operator = TOKEN_TO_BINARY_OP.get(token.kind);
    if (operator === undefined) {
        throw new Error(`Token is not an operator: ${TokenKind[token.kind]}`);
    }
    return operator;
}
export function unary(token, operand) {
    return {
        kind: "unary",
        operator: tokenToUnaryOperator(token),
        operand,
        offset: token.offset
    };
}
export function binary(left, token, right) {
    return {
        kind: "binary",
        left,
        operator: tokenToBinaryOperator(token),
        right,
        offset: token.offset
    };
}
export function ternary(antecedent, consequent, alternative) {
    return { kind: "ternary", antecedent, consequent, alternative };
}
export function cond(branches, alternative) {
    return { kind: "cond", branches, else: alternative };
}
export function case_(target, branches, alternative) {
    return { kind: "case", target, branches, else: alternative };
}
export function let_(bindings, body) {
    return { kind: "let", bindings, body };
}
export function boolean(token, state) {
    return {
        kind: "primitive",
        value: new XBoolean(token.literal, state),
        offset: token.offset
    };
}
export function integer(token, state) {
    return {
        kind: "primitive",
        value: new XInteger(token.literal, state),
        offset: token.offset
    };
}
export function float(token, state) {
    return {
        kind: "primitive",
        value: new XFloat(token.literal, state),
        offset: token.offset
    };
}
export function string(token, state) {
    return {
        kind: "primitive",
        value: new XString(token.literal, state),
        offset: token.offset
    };
}
export function templateString(token, state) {
    return {
        kind: "primitive",
        value: new XTemplateString(token.literal, state),
        offset: token.offset
    };
}
export function grouping(expression, offset) {
    return { kind: "grouping", expression, offset };
}
export function array(elements, offset) {
    return { kind: "array", elements, offset };
}
export function set(elements, offset) {
    return { kind: "set", elements, offset };
}
export function tuple(elements, offset) {
    return { kind: "tuple", elements, offset };
}
export function map(elements, offset) {
    return { kind: "map", elements, offset };
}
export function record(token, members) {
    return {
        kind: "record",
        name: token.lexeme,
        members,
        offset: token.offset
    };
}
export function optional(offset, value) {
    return { kind: "optional", value, offset };
}
export function identifier(token) {
    return {
        kind: "identifier",
        name: token.lexeme.toLowerCase(),
        offset: token.offset
    };
}
export function methodCall(receiver, token, args, offset) {
    return {
        kind: "method-call",
        receiver,
        identifier: identifier(token),
        arguments: args,
        offset
    };
}
export function index(receiver, index, offset) {
    return { kind: "index", receiver, index, offset };
}
export function lambda(parameters, body, offset) {
    return { kind: "lambda", parameters, body, offset };
}
export function toString(expr) {
    switch (expr.kind) {
        case "unary":
            return `${expr.operator}${toString(expr.operand)}`;
        case "binary":
            return `${toString(expr.left)} ${expr.operator} ${toString(expr.right)}`;
        case "ternary":
            return `${toString(expr.antecedent)} ? ${toString(expr.consequent)} : ${toString(expr.alternative)}`;
        case "cond": {
            const branches = expr.branches
                .map(([antecedent, consequent]) => {
                return `${toString(antecedent)}: ${toString(consequent)}`;
            })
                .join(", ");
            const elseBranch = expr.else === undefined ? "" : `else: ${toString(expr.else)}`;
            let body = "";
            if (branches !== "" && elseBranch !== "") {
                body = `${branches}, ${elseBranch}`;
            }
            else if (branches !== "") {
                body = branches;
            }
            else if (elseBranch !== "") {
                body = elseBranch;
            }
            return `cond {${body}}`;
        }
        case "case": {
            const branches = expr.branches
                .map(([case_, expression]) => {
                return `${toString(case_)}: ${toString(expression)}`;
            })
                .join(", ");
            const elseBranch = expr.else === undefined ? "" : `else: ${toString(expr.else)}`;
            let body = "";
            if (branches !== "" && elseBranch !== "") {
                body = `${branches}, ${elseBranch}`;
            }
            else if (branches !== "") {
                body = branches;
            }
            else if (elseBranch !== "") {
                body = elseBranch;
            }
            return `case ${toString(expr.target)} {${body}}`;
        }
        case "let": {
            const bindings = expr.bindings
                .map(([identifier, expression]) => {
                return `${toString(identifier)}: ${toString(expression)}`;
            })
                .join(", ");
            return `let {${bindings}} ${toString(expr.body)}`;
        }
        case "primitive":
            return expr.value.__toString();
        case "grouping":
            return `(${toString(expr.expression)})`;
        case "array":
            return `[${expr.elements.map(toString).join(" ")}]`;
        case "set":
            return `$[${expr.elements.map(toString).join(" ")}]`;
        case "tuple":
            return `@[${expr.elements.map(toString).join(" ")}]`;
        case "map": {
            const entries = expr.elements
                .map(([k, v]) => {
                return `${toString(k)}: ${toString(v)}`;
            })
                .join(", ");
            return `{${entries}}`;
        }
        case "record": {
            const members = expr.members
                .map(([name, value]) => {
                return `${toString(name)}: ${toString(value)}`;
            })
                .join(", ");
            return `${expr.name} {${members}}`;
        }
        case "method-call": {
            const args = expr.arguments.length === 0
                ? ""
                : `(${expr.arguments.map(toString).join(", ")})`;
            return `${toString(expr.receiver)}.${toString(expr.identifier)}${args}`;
        }
        case "index":
            return `${toString(expr.receiver)}.${toString(expr.index)}`;
        case "lambda":
            return `|${expr.parameters.map(toString).join(" ")}| ${toString(expr.body)}`;
        case "optional":
            return expr.value === undefined
                ? "none"
                : `some(${toString(expr.value)})`;
        case "identifier":
            return expr.name;
    }
}
//# sourceMappingURL=ast.js.map