var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Parser_instances, _Parser_tokens, _Parser_state, _Parser_current, _Parser_expression, _Parser_ternary, _Parser_boolean, _Parser_equality, _Parser_comparison, _Parser_term, _Parser_factor, _Parser_exponent, _Parser_optional, _Parser_method, _Parser_methodCall, _Parser_unary, _Parser_compound, _Parser_primary, _Parser_match, _Parser_check, _Parser_advance, _Parser_isAtEnd, _Parser_peek, _Parser_previous, _Parser_consume;
import { TokenKind } from "./token.js";
import { grouping, boolean, float, integer, binary, unary, string, templateString, set, array, methodCall, lambda, identifier, ternary, cond, case_, let_, map, optional, index, record, tuple } from "./ast.js";
import { UnexpectedEof, UnmatchedOpeningChar } from "./error.js";
export default class Parser {
    constructor(tokens, state) {
        _Parser_instances.add(this);
        _Parser_tokens.set(this, void 0);
        _Parser_state.set(this, void 0);
        _Parser_current.set(this, 0);
        __classPrivateFieldSet(this, _Parser_tokens, tokens, "f");
        __classPrivateFieldSet(this, _Parser_state, state, "f");
    }
    parse() {
        return __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_expression).call(this);
    }
}
_Parser_tokens = new WeakMap(), _Parser_state = new WeakMap(), _Parser_current = new WeakMap(), _Parser_instances = new WeakSet(), _Parser_expression = function _Parser_expression() {
    return __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_ternary).call(this);
}, _Parser_ternary = function _Parser_ternary() {
    const expression = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_boolean).call(this);
    if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Question)) {
        const consequent = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_ternary).call(this);
        __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_consume).call(this, TokenKind.Colon, "Expected `:` between consequent and alternative");
        const alternative = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_ternary).call(this);
        return ternary(expression, consequent, alternative);
    }
    return expression;
}, _Parser_boolean = function _Parser_boolean() {
    let expression = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_equality).call(this);
    while (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.And, TokenKind.Or)) {
        expression = binary(expression, __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_previous).call(this), __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_equality).call(this));
    }
    return expression;
}, _Parser_equality = function _Parser_equality() {
    let expression = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_comparison).call(this);
    while (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Equal, TokenKind.BangEqual)) {
        expression = binary(expression, __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_previous).call(this), __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_comparison).call(this));
    }
    return expression;
}, _Parser_comparison = function _Parser_comparison() {
    let expression = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_term).call(this);
    while (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Less, TokenKind.LessEqual, TokenKind.Greater, TokenKind.GreaterEqual)) {
        expression = binary(expression, __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_previous).call(this), __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_term).call(this));
    }
    return expression;
}, _Parser_term = function _Parser_term() {
    let expression = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_factor).call(this);
    while (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Minus, TokenKind.Plus)) {
        expression = binary(expression, __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_previous).call(this), __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_factor).call(this));
    }
    return expression;
}, _Parser_factor = function _Parser_factor() {
    let expression = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_exponent).call(this);
    while (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Slash, TokenKind.Star, TokenKind.Percent)) {
        expression = binary(expression, __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_previous).call(this), __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_exponent).call(this));
    }
    return expression;
}, _Parser_exponent = function _Parser_exponent() {
    let expression = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_optional).call(this);
    while (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Caret)) {
        expression = binary(expression, __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_previous).call(this), __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_optional).call(this));
    }
    return expression;
}, _Parser_optional = function _Parser_optional() {
    let expression = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_method).call(this);
    while (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.DoubleQuestion)) {
        expression = binary(expression, __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_previous).call(this), __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_method).call(this));
    }
    return expression;
}, _Parser_method = function _Parser_method() {
    var _a;
    let expression = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_unary).call(this);
    while (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Dot) ||
        ((_a = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_peek).call(this)) === null || _a === void 0 ? void 0 : _a.kind) === TokenKind.LeftBracket) {
        expression = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_methodCall).call(this, expression);
    }
    return expression;
}, _Parser_methodCall = function _Parser_methodCall(expression) {
    const offset = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_previous).call(this).offset;
    if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Integer)) {
        const indexExpression = integer(__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_previous).call(this), __classPrivateFieldGet(this, _Parser_state, "f"));
        return index(expression, indexExpression, offset);
    }
    if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.LeftBracket)) {
        const indexExpression = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_expression).call(this);
        __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_consume).call(this, TokenKind.RightBracket, "Expected `)` following expression", UnmatchedOpeningChar);
        return index(expression, indexExpression, offset);
    }
    if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Identifier)) {
        const identifier = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_previous).call(this);
        const args = [];
        if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.LeftParen)) {
            while (!__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_check).call(this, TokenKind.RightParen)) {
                args.push(__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_expression).call(this));
                __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Comma); // Skip optional comma
                if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_isAtEnd).call(this)) {
                    throw new UnmatchedOpeningChar("Expected closing `)`");
                }
            }
            __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_consume).call(this, TokenKind.RightParen, "");
        }
        return methodCall(expression, identifier, args, offset);
    }
    throw new Error("Expected an identifier");
}, _Parser_unary = function _Parser_unary() {
    if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Bang, TokenKind.Minus)) {
        return unary(__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_previous).call(this), __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_unary).call(this));
    }
    return __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_compound).call(this);
}, _Parser_compound = function _Parser_compound() {
    if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Cond)) {
        __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_consume).call(this, TokenKind.LeftBrace, "Expected `{` following `cond`");
        const branches = [];
        let alternative;
        while (!__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.RightBrace)) {
            if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Else)) {
                __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_consume).call(this, TokenKind.Colon, "Expected `:` following `else`");
                alternative = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_expression).call(this);
                __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_consume).call(this, TokenKind.RightBrace, "Expected closing `}` in `cond` expression", UnmatchedOpeningChar);
                break;
            }
            const antecedent = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_expression).call(this);
            __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_consume).call(this, TokenKind.Colon, "Expected `:` between antecedent and consequent");
            const consequent = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_expression).call(this);
            branches.push([antecedent, consequent]);
            __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Comma); // skip optional comma
            if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_isAtEnd).call(this)) {
                throw new UnmatchedOpeningChar("Expected closing `}` in `cond` expression");
            }
        }
        return cond(branches, alternative);
    }
    if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Case)) {
        const target = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_expression).call(this);
        const branches = [];
        let alternative;
        __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_consume).call(this, TokenKind.LeftBrace, "Expected `{` following `case`");
        while (!__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.RightBrace)) {
            if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Else)) {
                __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Colon); // skip optional colon
                alternative = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_expression).call(this);
                __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_consume).call(this, TokenKind.RightBrace, "Expected closing `}` in `case` expression", UnmatchedOpeningChar);
                break;
            }
            const antecedent = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_expression).call(this);
            __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Colon); // skip optional colon
            const consequent = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_expression).call(this);
            branches.push([antecedent, consequent]);
            __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Comma); // skip optional comma
            if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_isAtEnd).call(this)) {
                throw new UnmatchedOpeningChar("Expected closing `}` in `case` expression");
            }
        }
        return case_(target, branches, alternative);
    }
    if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Let)) {
        const bindings = [];
        __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_consume).call(this, TokenKind.LeftBrace, "Expected `{` following `let`");
        while (!__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.RightBrace)) {
            const name = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_primary).call(this);
            if (name.kind !== "identifier")
                throw new SyntaxError();
            __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Colon); // skip optional colon
            const expression = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_expression).call(this);
            __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Comma); // skip optional comma
            bindings.push([name, expression]);
            if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_isAtEnd).call(this)) {
                throw new UnmatchedOpeningChar("Expected closing `}` in `let` expression");
            }
        }
        const body = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_expression).call(this);
        return let_(bindings, body);
    }
    return __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_primary).call(this);
}, _Parser_primary = function _Parser_primary() {
    if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.False)) {
        return boolean(__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_previous).call(this), __classPrivateFieldGet(this, _Parser_state, "f"));
    }
    if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.True)) {
        return boolean(__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_previous).call(this), __classPrivateFieldGet(this, _Parser_state, "f"));
    }
    if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Integer)) {
        return integer(__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_previous).call(this), __classPrivateFieldGet(this, _Parser_state, "f"));
    }
    if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Float)) {
        return float(__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_previous).call(this), __classPrivateFieldGet(this, _Parser_state, "f"));
    }
    if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.String)) {
        return string(__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_previous).call(this), __classPrivateFieldGet(this, _Parser_state, "f"));
    }
    if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.TemplateString)) {
        return templateString(__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_previous).call(this), __classPrivateFieldGet(this, _Parser_state, "f"));
    }
    if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.None)) {
        return optional(__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_previous).call(this).offset);
    }
    if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Some)) {
        const offset = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_previous).call(this).offset;
        __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_consume).call(this, TokenKind.LeftParen, "Expected `(` following `some`");
        const expression = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_expression).call(this);
        __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_consume).call(this, TokenKind.RightParen, "Expected `)` following expression", UnmatchedOpeningChar);
        return optional(offset, expression);
    }
    if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Identifier)) {
        const token = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_previous).call(this);
        if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.LeftBrace)) {
            const members = [];
            while (!__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.RightBrace)) {
                const name = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_primary).call(this);
                if (name.kind !== "identifier") {
                    throw new SyntaxError();
                }
                __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Colon); // skip optional colon
                const value = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_expression).call(this);
                __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Comma); // skip optional comma
                members.push([name, value]);
            }
            return record(token, members);
        }
        else {
            return identifier(token);
        }
    }
    if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.LeftParen)) {
        const offset = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_previous).call(this).offset;
        const expression = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_expression).call(this);
        __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_consume).call(this, TokenKind.RightParen, "Expected `)` after expression", UnmatchedOpeningChar);
        return grouping(expression, offset);
    }
    if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.LeftBracket)) {
        const offset = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_previous).call(this).offset;
        const elements = [];
        while (!__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.RightBracket)) {
            elements.push(__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_expression).call(this));
            __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Comma); // Skip commas
            if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_isAtEnd).call(this)) {
                throw new UnmatchedOpeningChar("Expected closing `]` after expression");
            }
        }
        return array(elements, offset);
    }
    if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.SetBracket)) {
        const offset = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_previous).call(this).offset;
        const elements = [];
        while (!__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.RightBracket)) {
            elements.push(__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_expression).call(this));
            __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Comma); // Skip commas
            if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_isAtEnd).call(this)) {
                throw new UnmatchedOpeningChar("Expected closing `]` after expression");
            }
        }
        return set(elements, offset);
    }
    if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.TupleBracket)) {
        const offset = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_previous).call(this).offset;
        const elements = [];
        while (!__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.RightBracket)) {
            elements.push(__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_expression).call(this));
            __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Comma); // Skip commas
            if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_isAtEnd).call(this)) {
                throw new UnmatchedOpeningChar("Expected closing `]` after expression");
            }
        }
        return tuple(elements, offset);
    }
    if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.LeftBrace)) {
        const offset = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_previous).call(this).offset;
        const entries = [];
        while (!__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.RightBrace)) {
            const key = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_expression).call(this);
            __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Colon); // Skip optional colon
            const value = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_expression).call(this);
            __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Comma); // Skip optional colon
            if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_isAtEnd).call(this)) {
                throw new UnmatchedOpeningChar("Expected closing `}` in map literal");
            }
            entries.push([key, value]);
        }
        return map(entries, offset);
    }
    if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Bar)) {
        const offset = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_previous).call(this).offset;
        const parameters = [];
        while (!__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_match).call(this, TokenKind.Bar)) {
            parameters.push(identifier(__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_consume).call(this, TokenKind.Identifier, "Expected identifier")));
        }
        if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_isAtEnd).call(this)) {
            throw new UnexpectedEof("Expected expression after lambda params");
        }
        const body = __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_expression).call(this);
        return lambda(parameters, body, offset);
    }
    if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_isAtEnd).call(this)) {
        throw new UnexpectedEof();
    }
    throw new SyntaxError("WHOOPS!");
}, _Parser_match = function _Parser_match(...tokenKinds) {
    for (const kind of tokenKinds) {
        if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_check).call(this, kind)) {
            __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_advance).call(this);
            return true;
        }
    }
    return false;
}, _Parser_check = function _Parser_check(tokenKind) {
    if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_isAtEnd).call(this))
        return false;
    return __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_peek).call(this).kind === tokenKind;
}, _Parser_advance = function _Parser_advance() {
    var _a;
    if (!__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_isAtEnd).call(this))
        __classPrivateFieldSet(this, _Parser_current, (_a = __classPrivateFieldGet(this, _Parser_current, "f"), _a++, _a), "f");
    return __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_previous).call(this);
}, _Parser_isAtEnd = function _Parser_isAtEnd() {
    return __classPrivateFieldGet(this, _Parser_current, "f") >= __classPrivateFieldGet(this, _Parser_tokens, "f").length;
}, _Parser_peek = function _Parser_peek() {
    return __classPrivateFieldGet(this, _Parser_tokens, "f")[__classPrivateFieldGet(this, _Parser_current, "f")];
}, _Parser_previous = function _Parser_previous() {
    return __classPrivateFieldGet(this, _Parser_tokens, "f")[__classPrivateFieldGet(this, _Parser_current, "f") - 1];
}, _Parser_consume = function _Parser_consume(tokenKind, message, Err = SyntaxError) {
    if (__classPrivateFieldGet(this, _Parser_instances, "m", _Parser_check).call(this, tokenKind))
        return __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_advance).call(this);
    throw new Err(message);
};
//# sourceMappingURL=parser.js.map