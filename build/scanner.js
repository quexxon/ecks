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
var _Scanner_instances, _Scanner_source, _Scanner_state, _Scanner_tokens, _Scanner_start, _Scanner_current, _Scanner_isAtEnd, _Scanner_scanToken, _Scanner_scanString, _Scanner_scanNumber, _Scanner_scanIdentifier, _Scanner_advance, _Scanner_peek, _Scanner_peekNext, _Scanner_addToken, _Scanner_isMatch, _Scanner_isAlpha, _Scanner_isAlphaNumeric, _Scanner_isDigit, _Scanner_isOctalDigit, _Scanner_isHexDigit;
import Token, { TokenKind } from "./token.js";
export default class Scanner {
    constructor(source, state) {
        _Scanner_instances.add(this);
        _Scanner_source.set(this, void 0);
        _Scanner_state.set(this, void 0);
        _Scanner_tokens.set(this, []);
        _Scanner_start.set(this, 0);
        _Scanner_current.set(this, 0);
        __classPrivateFieldSet(this, _Scanner_source, source, "f");
        __classPrivateFieldSet(this, _Scanner_state, state, "f");
    }
    scan() {
        while (!__classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_isAtEnd).call(this)) {
            __classPrivateFieldSet(this, _Scanner_start, __classPrivateFieldGet(this, _Scanner_current, "f"), "f");
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_scanToken).call(this);
        }
        return __classPrivateFieldGet(this, _Scanner_tokens, "f");
    }
}
_Scanner_source = new WeakMap(), _Scanner_state = new WeakMap(), _Scanner_tokens = new WeakMap(), _Scanner_start = new WeakMap(), _Scanner_current = new WeakMap(), _Scanner_instances = new WeakSet(), _Scanner_isAtEnd = function _Scanner_isAtEnd() {
    return __classPrivateFieldGet(this, _Scanner_current, "f") >= __classPrivateFieldGet(this, _Scanner_source, "f").length;
}, _Scanner_scanToken = function _Scanner_scanToken() {
    const char = __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_advance).call(this);
    switch (char) {
        // Single character tokens
        case "(":
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, TokenKind.LeftParen);
            break;
        case ")":
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, TokenKind.RightParen);
            break;
        case "{":
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, TokenKind.LeftBrace);
            break;
        case "}":
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, TokenKind.RightBrace);
            break;
        case "[":
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, TokenKind.LeftBracket);
            break;
        case "]":
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, TokenKind.RightBracket);
            break;
        case "|":
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, TokenKind.Bar);
            break;
        case ".":
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, TokenKind.Dot);
            break;
        case ",":
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, TokenKind.Comma);
            break;
        case "-":
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, TokenKind.Minus);
            break;
        case "+":
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, TokenKind.Plus);
            break;
        case "=":
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, TokenKind.Equal);
            break;
        case "^":
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, TokenKind.Caret);
            break;
        case "*":
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, TokenKind.Star);
            break;
        case "/":
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, TokenKind.Slash);
            break;
        case ":":
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, TokenKind.Colon);
            break;
        case "&":
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, TokenKind.Ampersand);
            break;
        case "%":
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, TokenKind.Percent);
            break;
        // Two character tokens
        case "$":
            if (!__classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_isMatch).call(this, "["))
                throw new Error(`Invalid character: ${char}`);
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, TokenKind.SetBracket);
            break;
        case "@":
            if (!__classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_isMatch).call(this, "["))
                throw new Error(`Invalid character: ${char}`);
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, TokenKind.TupleBracket);
            break;
        // Potentially two character tokens
        case "!":
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_isMatch).call(this, "=") ? TokenKind.BangEqual : TokenKind.Bang);
            break;
        case ">":
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_isMatch).call(this, "=")
                ? TokenKind.GreaterEqual
                : TokenKind.Greater);
            break;
        case "<":
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_isMatch).call(this, "=") ? TokenKind.LessEqual : TokenKind.Less);
            break;
        case "?":
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_isMatch).call(this, "?")
                ? TokenKind.DoubleQuestion
                : TokenKind.Question);
            break;
        // Omit whitespace
        case " ":
        case "\t":
        case "\r":
        case "\n":
            break;
        // Strings
        case '"':
        case "'":
        case "`":
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_scanString).call(this, char);
            break;
        default:
            if (__classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_isDigit).call(this, char) || char === "#") {
                __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_scanNumber).call(this, char);
            }
            else if (__classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_isAlpha).call(this, char)) {
                __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_scanIdentifier).call(this);
            }
            else {
                throw new Error(`Invalid character: ${char}`);
            }
    }
}, _Scanner_scanString = function _Scanner_scanString(quoteChar) {
    const isTemplateString = quoteChar === "`";
    let inExpression = false;
    let depth = 0;
    let isEscape = false;
    while ((__classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_peek).call(this) !== quoteChar || inExpression) &&
        !__classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_isAtEnd).call(this)) {
        if (isEscape) {
            isEscape = false;
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_advance).call(this);
            continue;
        }
        else {
            if (isTemplateString && __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_peek).call(this) === "{") {
                if (depth === 0)
                    inExpression = true;
                depth++;
            }
            if (isTemplateString && __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_peek).call(this) === "}") {
                depth--;
                if (depth < 0)
                    throw new SyntaxError("Unmatched `}` in template string");
                if (depth === 0)
                    inExpression = false;
            }
        }
        if (__classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_peek).call(this) === "\\") {
            isEscape = true;
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_advance).call(this);
            if (__classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_peek).call(this) === quoteChar) {
                __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_advance).call(this);
            }
        }
        else {
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_advance).call(this);
        }
    }
    if (depth !== 0)
        throw new SyntaxError("Unmatched `{` in template string");
    if (__classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_isAtEnd).call(this))
        throw new SyntaxError("Unterminated string");
    // Skip the closing quote
    __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_advance).call(this);
    const literal = __classPrivateFieldGet(this, _Scanner_source, "f").slice(__classPrivateFieldGet(this, _Scanner_start, "f") + 1, __classPrivateFieldGet(this, _Scanner_current, "f") - 1);
    __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, isTemplateString ? TokenKind.TemplateString : TokenKind.String, literal);
}, _Scanner_scanNumber = function _Scanner_scanNumber(firstChar) {
    let tokenKind = TokenKind.Integer;
    let mayBeFloat = true;
    let isDigit = (char) => __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_isDigit).call(this, char);
    let parseNum = (str) => parseInt(str);
    switch (firstChar) {
        case "0":
            if (__classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_isOctalDigit).call(this, __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_peek).call(this))) {
                mayBeFloat = false;
                isDigit = __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_isOctalDigit);
                parseNum = (str) => parseInt(str.slice(1), 8);
            }
            break;
        case "#":
            mayBeFloat = false;
            isDigit = (char) => __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_isHexDigit).call(this, char);
            parseNum = (str) => parseInt(str.slice(1), 16);
            if (!isDigit(__classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_peek).call(this)))
                throw new Error("Unexpected token `#`");
            break;
    }
    while (isDigit(__classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_peek).call(this)))
        __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_advance).call(this);
    if (mayBeFloat &&
        __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_peek).call(this) === "." &&
        __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_isDigit).call(this, __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_peekNext).call(this))) {
        tokenKind = TokenKind.Float;
        parseNum = (str) => parseFloat(str);
        __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_advance).call(this);
        while (isDigit(__classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_peek).call(this)))
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_advance).call(this);
        // Check for exponent
        if (__classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_peek).call(this).toLowerCase() === "e" &&
            (isDigit(__classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_peekNext).call(this)) || __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_peekNext).call(this) === "-")) {
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_advance).call(this);
            if (__classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_peek).call(this) === "-") {
                if (!isDigit(__classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_peekNext).call(this))) {
                    throw new Error("Invalid float literal exponent");
                }
                __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_advance).call(this);
            }
            while (isDigit(__classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_peek).call(this)))
                __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_advance).call(this);
        }
    }
    const str = __classPrivateFieldGet(this, _Scanner_source, "f").slice(__classPrivateFieldGet(this, _Scanner_start, "f"), __classPrivateFieldGet(this, _Scanner_current, "f"));
    __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, tokenKind, parseNum(str));
}, _Scanner_scanIdentifier = function _Scanner_scanIdentifier() {
    while (__classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_isAlphaNumeric).call(this, __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_peek).call(this)))
        __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_advance).call(this);
    const identifier = __classPrivateFieldGet(this, _Scanner_source, "f")
        .slice(__classPrivateFieldGet(this, _Scanner_start, "f"), __classPrivateFieldGet(this, _Scanner_current, "f"))
        .toLowerCase();
    switch (identifier) {
        case "and":
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, TokenKind.And);
            break;
        case "or":
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, TokenKind.Or);
            break;
        case "case":
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, TokenKind.Case);
            break;
        case "cond":
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, TokenKind.Cond);
            break;
        case "else":
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, TokenKind.Else);
            break;
        case "let":
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, TokenKind.Let);
            break;
        case "true":
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, TokenKind.True, true);
            break;
        case "false":
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, TokenKind.False, false);
            break;
        case "some":
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, TokenKind.Some);
            break;
        case "none":
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, TokenKind.None);
            break;
        default:
            __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_addToken).call(this, TokenKind.Identifier);
            break;
    }
}, _Scanner_advance = function _Scanner_advance() {
    var _a, _b;
    return __classPrivateFieldGet(this, _Scanner_source, "f")[__classPrivateFieldSet(this, _Scanner_current, (_b = __classPrivateFieldGet(this, _Scanner_current, "f"), _a = _b++, _b), "f"), _a];
}, _Scanner_peek = function _Scanner_peek() {
    if (__classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_isAtEnd).call(this))
        return "";
    return __classPrivateFieldGet(this, _Scanner_source, "f")[__classPrivateFieldGet(this, _Scanner_current, "f")];
}, _Scanner_peekNext = function _Scanner_peekNext() {
    if (__classPrivateFieldGet(this, _Scanner_current, "f") + 1 >= __classPrivateFieldGet(this, _Scanner_source, "f").length)
        return "";
    return __classPrivateFieldGet(this, _Scanner_source, "f")[__classPrivateFieldGet(this, _Scanner_current, "f") + 1];
}, _Scanner_addToken = function _Scanner_addToken(kind, literal) {
    const lexeme = __classPrivateFieldGet(this, _Scanner_source, "f").slice(__classPrivateFieldGet(this, _Scanner_start, "f"), __classPrivateFieldGet(this, _Scanner_current, "f"));
    __classPrivateFieldGet(this, _Scanner_tokens, "f").push(new Token(kind, __classPrivateFieldGet(this, _Scanner_start, "f"), lexeme, literal));
}, _Scanner_isMatch = function _Scanner_isMatch(char) {
    var _a;
    if (__classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_isAtEnd).call(this))
        return false;
    if (__classPrivateFieldGet(this, _Scanner_source, "f")[__classPrivateFieldGet(this, _Scanner_current, "f")] !== char)
        return false;
    __classPrivateFieldSet(this, _Scanner_current, (_a = __classPrivateFieldGet(this, _Scanner_current, "f"), _a++, _a), "f");
    return true;
}, _Scanner_isAlpha = function _Scanner_isAlpha(char) {
    char = char.toLowerCase();
    return char >= "a" && char <= "z";
}, _Scanner_isAlphaNumeric = function _Scanner_isAlphaNumeric(char) {
    return __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_isAlpha).call(this, char) || __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_isDigit).call(this, char);
}, _Scanner_isDigit = function _Scanner_isDigit(char) {
    return char >= "0" && char <= "9";
}, _Scanner_isOctalDigit = function _Scanner_isOctalDigit(char) {
    return char >= "0" && char <= "7";
}, _Scanner_isHexDigit = function _Scanner_isHexDigit(char) {
    char = char.toLowerCase();
    return __classPrivateFieldGet(this, _Scanner_instances, "m", _Scanner_isDigit).call(this, char) || (char >= "a" && char <= "f");
};
//# sourceMappingURL=scanner.js.map