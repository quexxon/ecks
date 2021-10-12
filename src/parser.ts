import Token, { TokenKind } from './token'
import {
  Expression,
  grouping,
  boolean,
  float,
  integer,
  binary,
  unary,
  string,
  templateString,
  set,
  array
} from './ast'

export default class Parser {
  #tokens: Token[]
  #current: number = 0

  constructor (tokens: Token[]) {
    this.#tokens = tokens
  }

  parse (): Expression {
    return this.#expression()
  }

  #expression (): Expression {
    return this.#equality()
  }

  #equality (): Expression {
    let expression: Expression = this.#boolean()

    while (this.#match(TokenKind.Equal, TokenKind.BangEqual)) {
      expression = binary(expression, this.#previous(), this.#boolean())
    }

    return expression
  }

  #boolean (): Expression {
    let expression: Expression = this.#comparison()

    while (this.#match(TokenKind.Bar, TokenKind.Ampersand)) {
      expression = binary(expression, this.#previous(), this.#comparison())
    }

    return expression
  }

  #comparison (): Expression {
    let expression: Expression = this.#term()

    while (this.#match(
      TokenKind.Less, TokenKind.LessEqual, TokenKind.Greater, TokenKind.GreaterEqual
    )) {
      expression = binary(expression, this.#previous(), this.#term())
    }

    return expression
  }

  #term (): Expression {
    let expression: Expression = this.#factor()

    while (this.#match(TokenKind.Minus, TokenKind.Plus)) {
      expression = binary(expression, this.#previous(), this.#factor())
    }

    return expression
  }

  #factor (): Expression {
    let expression: Expression = this.#unary()

    while (this.#match(TokenKind.Slash, TokenKind.Star)) {
      expression = binary(expression, this.#previous(), this.#unary())
    }

    return expression
  }

  #unary (): Expression {
    if (this.#match(TokenKind.Bang, TokenKind.Minus)) {
      return unary(this.#previous(), this.#unary())
    }

    return this.#primary()
  }

  #primary (): Expression {
    if (this.#match(TokenKind.False)) return boolean(this.#previous())
    if (this.#match(TokenKind.True)) return boolean(this.#previous())

    if (this.#match(TokenKind.Integer)) return integer(this.#previous())
    if (this.#match(TokenKind.Float)) return float(this.#previous())

    if (this.#match(TokenKind.String)) return string(this.#previous())
    if (this.#match(TokenKind.TemplateString)) return templateString(this.#previous())

    if (this.#match(TokenKind.LeftParen)) {
      const offset = this.#previous().offset
      const expression = this.#expression()
      this.#consume(TokenKind.RightParen, 'Expected `)` after expression')
      return grouping(expression, offset)
    }

    if (this.#match(TokenKind.LeftBracket)) {
      const offset = this.#previous().offset
      const elements = []
      while (!this.#match(TokenKind.RightBracket)) {
        elements.push(this.#expression())
        if (this.#isAtEnd()) {
          throw new Error('Expected closing `]` after expression')
        }
      }
      return array(elements, offset)
    }

    if (this.#match(TokenKind.SetBracket)) {
      const offset = this.#previous().offset
      const elements = []
      while (!this.#match(TokenKind.RightBracket)) {
        elements.push(this.#expression())
        if (this.#isAtEnd()) {
          throw new Error('Expected closing `]` after expression')
        }
      }
      return set(elements, offset)
    }

    throw new Error('WHOOPS!')
  }

  #match (...tokenKinds: TokenKind[]): boolean {
    for (const kind of tokenKinds) {
      if (this.#check(kind)) {
        this.#advance()
        return true
      }
    }

    return false
  }

  #check (tokenKind: TokenKind): boolean {
    if (this.#isAtEnd()) return false
    return this.#peek().kind === tokenKind
  }

  #advance (): Token {
    if (!this.#isAtEnd()) this.#current++
    return this.#previous()
  }

  #isAtEnd (): boolean {
    return this.#current >= this.#tokens.length
  }

  #peek (): Token {
    return this.#tokens[this.#current]
  }

  #previous (): Token {
    return this.#tokens[this.#current - 1]
  }

  #consume (tokenKind: TokenKind, message: string): Token {
    if (this.#check(tokenKind)) return this.#advance()
    throw new Error(message)
  }
}
