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
var _Token_kind, _Token_offset, _Token_lexeme, _Token_literal;
export var TokenKind;
(function (TokenKind) {
    // Single characters
    TokenKind[TokenKind["LeftParen"] = 0] = "LeftParen";
    TokenKind[TokenKind["RightParen"] = 1] = "RightParen";
    TokenKind[TokenKind["LeftBrace"] = 2] = "LeftBrace";
    TokenKind[TokenKind["RightBrace"] = 3] = "RightBrace";
    TokenKind[TokenKind["LeftBracket"] = 4] = "LeftBracket";
    TokenKind[TokenKind["RightBracket"] = 5] = "RightBracket";
    TokenKind[TokenKind["Bar"] = 6] = "Bar";
    TokenKind[TokenKind["Dot"] = 7] = "Dot";
    TokenKind[TokenKind["Comma"] = 8] = "Comma";
    TokenKind[TokenKind["Minus"] = 9] = "Minus";
    TokenKind[TokenKind["Plus"] = 10] = "Plus";
    TokenKind[TokenKind["Equal"] = 11] = "Equal";
    TokenKind[TokenKind["Caret"] = 12] = "Caret";
    TokenKind[TokenKind["Star"] = 13] = "Star";
    TokenKind[TokenKind["Slash"] = 14] = "Slash";
    TokenKind[TokenKind["Colon"] = 15] = "Colon";
    TokenKind[TokenKind["Ampersand"] = 16] = "Ampersand";
    TokenKind[TokenKind["Percent"] = 17] = "Percent";
    // Two characters
    TokenKind[TokenKind["SetBracket"] = 18] = "SetBracket";
    TokenKind[TokenKind["TupleBracket"] = 19] = "TupleBracket";
    // Potentially two characters
    TokenKind[TokenKind["Bang"] = 20] = "Bang";
    TokenKind[TokenKind["BangEqual"] = 21] = "BangEqual";
    TokenKind[TokenKind["Greater"] = 22] = "Greater";
    TokenKind[TokenKind["GreaterEqual"] = 23] = "GreaterEqual";
    TokenKind[TokenKind["Less"] = 24] = "Less";
    TokenKind[TokenKind["LessEqual"] = 25] = "LessEqual";
    TokenKind[TokenKind["Question"] = 26] = "Question";
    TokenKind[TokenKind["DoubleQuestion"] = 27] = "DoubleQuestion";
    // Literals
    TokenKind[TokenKind["String"] = 28] = "String";
    TokenKind[TokenKind["TemplateString"] = 29] = "TemplateString";
    TokenKind[TokenKind["Integer"] = 30] = "Integer";
    TokenKind[TokenKind["Float"] = 31] = "Float";
    TokenKind[TokenKind["Identifier"] = 32] = "Identifier";
    // Keywords
    TokenKind[TokenKind["And"] = 33] = "And";
    TokenKind[TokenKind["Or"] = 34] = "Or";
    TokenKind[TokenKind["Case"] = 35] = "Case";
    TokenKind[TokenKind["Cond"] = 36] = "Cond";
    TokenKind[TokenKind["Else"] = 37] = "Else";
    TokenKind[TokenKind["Let"] = 38] = "Let";
    TokenKind[TokenKind["True"] = 39] = "True";
    TokenKind[TokenKind["False"] = 40] = "False";
    TokenKind[TokenKind["Some"] = 41] = "Some";
    TokenKind[TokenKind["None"] = 42] = "None";
})(TokenKind || (TokenKind = {}));
export default class Token {
    constructor(kind, offset, lexeme, literal) {
        _Token_kind.set(this, void 0);
        _Token_offset.set(this, void 0);
        _Token_lexeme.set(this, void 0);
        _Token_literal.set(this, void 0);
        __classPrivateFieldSet(this, _Token_kind, kind, "f");
        __classPrivateFieldSet(this, _Token_lexeme, lexeme, "f");
        __classPrivateFieldSet(this, _Token_offset, offset, "f");
        __classPrivateFieldSet(this, _Token_literal, literal, "f");
    }
    get kind() {
        return __classPrivateFieldGet(this, _Token_kind, "f");
    }
    get offset() {
        return __classPrivateFieldGet(this, _Token_offset, "f");
    }
    get lexeme() {
        return __classPrivateFieldGet(this, _Token_lexeme, "f");
    }
    get literal() {
        return __classPrivateFieldGet(this, _Token_literal, "f");
    }
}
_Token_kind = new WeakMap(), _Token_offset = new WeakMap(), _Token_lexeme = new WeakMap(), _Token_literal = new WeakMap();
//# sourceMappingURL=token.js.map