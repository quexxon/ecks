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
  array,
  methodCall,
  lambda,
  identifier,
  ternary
} from './ast'
import { Environment } from './types'

export default class Parser {
  #tokens: Token[]
  #environment: Environment
  #current: number = 0

  constructor (tokens: Token[], environment: Environment = new Map()) {
    this.#tokens = tokens
    this.#environment = environment
  }

  parse (): Expression {
    return this.#expression()
  }

  #expression (): Expression {
    return this.#conditional()
  }

  #conditional (): Expression {
    let expression: Expression = this.#equality()

    if (this.#match(TokenKind.Question)) {
      const consequent = this.#conditional()
      if (this.#match(TokenKind.Colon)) {
        const alternative = this.#conditional()
        expression = ternary(expression, consequent, alternative)
      } else {
        throw new SyntaxError()
      }
    }

    return expression
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
    let expression: Expression = this.#method()

    while (this.#match(TokenKind.Slash, TokenKind.Star)) {
      expression = binary(expression, this.#previous(), this.#method())
    }

    return expression
  }

  #method (): Expression {
    let expression: Expression = this.#unary()

    while (this.#match(TokenKind.Dot)) {
      expression = this.#methodCall(expression)
    }

    return expression
  }

  #methodCall (expression: Expression): Expression {
    const offset = this.#previous().offset
    if (this.#match(TokenKind.Identifier)) {
      const identifier = this.#previous()
      const args = []
      if (this.#match(TokenKind.LeftParen)) {
        while (!this.#check(TokenKind.RightParen)) {
          args.push(this.#expression())
          this.#match(TokenKind.Comma) // Skip optional comma
          if (this.#isAtEnd()) {
            throw new Error('Expected closing `)`')
          }
        }
        this.#consume(TokenKind.RightParen, '')
      }
      return methodCall(expression, identifier, args, offset)
    }

    throw new Error('Expected an identifier')
  }

  #unary (): Expression {
    if (this.#match(TokenKind.Bang, TokenKind.Minus)) {
      return unary(this.#previous(), this.#unary())
    }

    return this.#primary()
  }

  #primary (): Expression {
    if (this.#match(TokenKind.False)) return boolean(this.#previous(), this.#environment)
    if (this.#match(TokenKind.True)) return boolean(this.#previous(), this.#environment)

    if (this.#match(TokenKind.Integer)) return integer(this.#previous(), this.#environment)
    if (this.#match(TokenKind.Float)) return float(this.#previous(), this.#environment)

    if (this.#match(TokenKind.String)) return string(this.#previous(), this.#environment)
    if (this.#match(TokenKind.TemplateString)) return templateString(this.#previous(), this.#environment)

    if (this.#match(TokenKind.Identifier)) return identifier(this.#previous())

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
        this.#match(TokenKind.Comma) // Skip commas
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
        this.#match(TokenKind.Comma) // Skip commas
        if (this.#isAtEnd()) {
          throw new Error('Expected closing `]` after expression')
        }
      }
      return set(elements, offset)
    }

    if (this.#match(TokenKind.Bar)) {
      const offset = this.#previous().offset
      const parameters = []
      while (!this.#match(TokenKind.Bar)) {
        parameters.push(
          identifier(this.#consume(TokenKind.Identifier, 'Expected identifier'))
        )
      }
      if (this.#isAtEnd()) {
        throw new Error('Expected expression after lambda params')
      }
      const body = this.#expression()
      return lambda(parameters, body, offset)
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
