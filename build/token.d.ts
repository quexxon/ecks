export declare enum TokenKind {
    LeftParen = 0,
    RightParen = 1,
    LeftBrace = 2,
    RightBrace = 3,
    LeftBracket = 4,
    RightBracket = 5,
    Bar = 6,
    Dot = 7,
    Comma = 8,
    Minus = 9,
    Plus = 10,
    Equal = 11,
    Caret = 12,
    Star = 13,
    Slash = 14,
    Colon = 15,
    Ampersand = 16,
    Percent = 17,
    SetBracket = 18,
    TupleBracket = 19,
    Bang = 20,
    BangEqual = 21,
    Greater = 22,
    GreaterEqual = 23,
    Less = 24,
    LessEqual = 25,
    Question = 26,
    DoubleQuestion = 27,
    String = 28,
    TemplateString = 29,
    Integer = 30,
    Float = 31,
    Identifier = 32,
    And = 33,
    Or = 34,
    Case = 35,
    Cond = 36,
    Else = 37,
    Let = 38,
    True = 39,
    False = 40,
    Some = 41,
    None = 42
}
export default class Token {
    #private;
    get kind(): TokenKind;
    get offset(): number;
    get lexeme(): string;
    get literal(): string | number | boolean | undefined;
    constructor(kind: TokenKind, offset: number, lexeme: string, literal?: string | number | boolean);
}
