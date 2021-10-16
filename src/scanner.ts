import Token, { TokenKind } from './token'

export default class Scanner {
  #source: string
  #tokens: Token[] = []
  #start: number = 0
  #current: number = 0

  constructor (source: string) {
    this.#source = source
  }

  scan (): Token[] {
    while (!this.#isAtEnd()) {
      this.#start = this.#current
      this.#scanToken()
    }

    return this.#tokens
  }

  #isAtEnd (): boolean {
    return this.#current >= this.#source.length
  }

  #scanToken (): void {
    const char: string = this.#advance()

    switch (char) {
      // Single character tokens
      case '(': this.#addToken(TokenKind.LeftParen); break
      case ')': this.#addToken(TokenKind.RightParen); break
      case '{': this.#addToken(TokenKind.LeftBrace); break
      case '}': this.#addToken(TokenKind.RightBrace); break
      case '[': this.#addToken(TokenKind.LeftBracket); break
      case ']': this.#addToken(TokenKind.RightBracket); break
      case '|': this.#addToken(TokenKind.Bar); break
      case '.': this.#addToken(TokenKind.Dot); break
      case ',': this.#addToken(TokenKind.Comma); break
      case '-': this.#addToken(TokenKind.Minus); break
      case '+': this.#addToken(TokenKind.Plus); break
      case '=': this.#addToken(TokenKind.Equal); break
      case '^': this.#addToken(TokenKind.Caret); break
      case '*': this.#addToken(TokenKind.Star); break
      case '/': this.#addToken(TokenKind.Slash); break
      case ':': this.#addToken(TokenKind.Colon); break
      case '&': this.#addToken(TokenKind.Ampersand); break
      case '%': this.#addToken(TokenKind.Percent); break

      // Two character tokens
      case '$':
        if (!this.#isMatch('[')) throw new Error(`Invalid character: ${char}`)
        this.#addToken(TokenKind.SetBracket)
        break
      case '@':
        if (!this.#isMatch('[')) throw new Error(`Invalid character: ${char}`)
        this.#addToken(TokenKind.TupleBracket)
        break

      // Potentially two character tokens
      case '!':
        this.#addToken(this.#isMatch('=') ? TokenKind.BangEqual : TokenKind.Bang)
        break
      case '>':
        this.#addToken(this.#isMatch('=') ? TokenKind.GreaterEqual : TokenKind.Greater)
        break
      case '<':
        this.#addToken(this.#isMatch('=') ? TokenKind.LessEqual : TokenKind.Less)
        break
      case '?':
        this.#addToken(this.#isMatch('?') ? TokenKind.DoubleQuestion : TokenKind.Question)
        break

      // Omit whitespace
      case ' ':
      case '\t':
      case '\r':
      case '\n':
        break

      // Strings
      case '"':
      case "'":
      case '`':
        this.#scanString(char)
        break

      default:
        if (this.#isDigit(char) || char === '#') {
          this.#scanNumber(char)
        } else if (this.#isAlpha(char)) {
          this.#scanIdentifier()
        } else {
          throw new Error(`Invalid character: ${char}`)
        }
    }
  }

  #scanString (quoteChar: string): void {
    const isTemplateString = quoteChar === '`'
    let inExpression = false
    let depth = 0
    let isEscape = false

    while ((this.#peek() !== quoteChar || inExpression) && !this.#isAtEnd()) {
      if (isEscape) {
        isEscape = false
      } else {
        if (isTemplateString && this.#peek() === '{') {
          if (depth === 0) inExpression = true
          depth++
        }

        if (isTemplateString && this.#peek() === '}') {
          depth--
          if (depth < 0) throw new SyntaxError('Unmatched `}` in template string')
          if (depth === 0) inExpression = false
        }
      }

      if (this.#peek() === '\\') {
        isEscape = true
        this.#advance()
        if (this.#peek() === quoteChar) {
          this.#advance()
        }
      } else {
        this.#advance()
      }
    }

    if (depth !== 0) throw new SyntaxError('Unmatched `{` in template string')

    if (this.#isAtEnd()) throw new SyntaxError('Unterminated string')

    // Skip the closing quote
    this.#advance()

    const literal = this.#source.slice(this.#start + 1, this.#current - 1)

    this.#addToken(
      isTemplateString ? TokenKind.TemplateString : TokenKind.String,
      literal
    )
  }

  #scanNumber (firstChar: string): void {
    let tokenKind = TokenKind.Integer
    let mayBeFloat = true
    let isDigit = (char: string): boolean => this.#isDigit(char)
    let parseNum = (str: string): number => parseInt(str)

    switch (firstChar) {
      case '0':
        if (this.#isOctalDigit(this.#peek())) {
          mayBeFloat = false
          isDigit = this.#isOctalDigit
          parseNum = str => parseInt(str.slice(1), 8)
        }
        break

      case '#':
        mayBeFloat = false
        isDigit = char => this.#isHexDigit(char)
        parseNum = str => parseInt(str.slice(1), 16)
        if (!isDigit(this.#peek())) throw new Error('Unexpected token `#`')
        break
    }

    while (isDigit(this.#peek())) this.#advance()

    if (mayBeFloat && this.#peek() === '.' && this.#isDigit(this.#peekNext())) {
      tokenKind = TokenKind.Float
      parseNum = str => parseFloat(str)
      this.#advance()

      while (isDigit(this.#peek())) this.#advance()

      // Check for exponent
      if (
        this.#peek().toLowerCase() === 'e' &&
        (isDigit(this.#peekNext()) || this.#peekNext() === '-')
      ) {
        this.#advance()

        if (this.#peek() === '-') {
          if (!isDigit(this.#peekNext())) {
            throw new Error('Invalid float literal exponent')
          }

          this.#advance()
        }

        while (isDigit(this.#peek())) this.#advance()
      }
    }

    const str: string = this.#source.slice(this.#start, this.#current)
    this.#addToken(tokenKind, parseNum(str))
  }

  #scanIdentifier (): void {
    while (this.#isAlphaNumeric(this.#peek())) this.#advance()

    const identifier: string =
      this.#source.slice(this.#start, this.#current)
        .toLowerCase()

    switch (identifier) {
      case 'and': this.#addToken(TokenKind.And); break
      case 'or': this.#addToken(TokenKind.Or); break
      case 'case': this.#addToken(TokenKind.Case); break
      case 'cond': this.#addToken(TokenKind.Cond); break
      case 'else': this.#addToken(TokenKind.Else); break
      case 'let': this.#addToken(TokenKind.Let); break
      case 'true': this.#addToken(TokenKind.True, true); break
      case 'false': this.#addToken(TokenKind.False, false); break
      case 'some': this.#addToken(TokenKind.Some); break
      case 'none': this.#addToken(TokenKind.None); break
      default: this.#addToken(TokenKind.Identifier); break
    }
  }

  #advance (): string {
    return this.#source[this.#current++]
  }

  #peek (): string {
    if (this.#isAtEnd()) return ''
    return this.#source[this.#current]
  }

  #peekNext (): string {
    if (this.#current + 1 >= this.#source.length) return ''
    return this.#source[this.#current + 1]
  }

  #addToken (kind: TokenKind, literal?: number | string | boolean): void {
    const lexeme = this.#source.slice(this.#start, this.#current)
    this.#tokens.push(new Token(kind, this.#start, lexeme, literal))
  }

  #isMatch (char: string): boolean {
    if (this.#isAtEnd()) return false
    if (this.#source[this.#current] !== char) return false
    this.#current++
    return true
  }

  #isAlpha (char: string): boolean {
    char = char.toLowerCase()
    return char >= 'a' && char <= 'z'
  }

  #isAlphaNumeric (char: string): boolean {
    return this.#isAlpha(char) || this.#isDigit(char)
  }

  #isDigit (char: string): boolean {
    return char >= '0' && char <= '9'
  }

  #isOctalDigit (char: string): boolean {
    return char >= '0' && char <= '7'
  }

  #isHexDigit (char: string): boolean {
    char = char.toLowerCase()
    return this.#isDigit(char) || (char >= 'a' && char <= 'f')
  }
}
