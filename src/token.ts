export enum TokenKind {
  // Single characters
  LeftParen,
  RightParen,
  LeftBrace,
  RightBrace,
  LeftBracket,
  RightBracket,
  Bar,
  Dot,
  Comma,
  Minus,
  Plus,
  Equal,
  Caret,
  Star,
  Slash,
  Colon,
  Ampersand,
  Percent,

  // Two characters
  SetBracket,
  TupleBracket,

  // Potentially two characters
  Bang,
  BangEqual,
  Greater,
  GreaterEqual,
  Less,
  LessEqual,
  Question,
  DoubleQuestion,

  // Literals
  String,
  TemplateString,
  Integer,
  Float,
  Identifier,

  // Keywords
  And,
  Or,
  Case,
  Cond,
  Else,
  True,
  False,
}

export default class Token {
  #kind: TokenKind
  #offset: number
  #lexeme: string
  #literal?: string | number | boolean

  get kind (): TokenKind { return this.#kind }
  get offset (): number { return this.#offset }
  get lexeme (): string { return this.#lexeme }
  get literal (): string | number | boolean | undefined { return this.#literal }

  constructor (
    kind: TokenKind,
    offset: number,
    lexeme: string,
    literal?: string | number | boolean
  ) {
    this.#kind = kind
    this.#lexeme = lexeme
    this.#offset = offset
    this.#literal = literal
  }
}
