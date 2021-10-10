import Token, { TokenKind } from './token'

enum Operator {
  Addition = '+',
  Subtraction = '-',
  Multiplication = '*',
  Division = '/',
  Equal = '=',
  NotEqual = '!=',
  Not = '!',
  LessThan = '<',
  LessThanOrEqual = '<=',
  GreaterThan = '>',
  GreaterThanOrEqual = '>=',
  Or = '|',
  And = '&',
}

const tokenOperatorEquivalents = new Map([
  [TokenKind.Plus, Operator.Addition],
  [TokenKind.Minus, Operator.Subtraction],
  [TokenKind.Star, Operator.Multiplication],
  [TokenKind.Slash, Operator.Division],
  [TokenKind.Equal, Operator.Equal],
  [TokenKind.BangEqual, Operator.NotEqual],
  [TokenKind.Bang, Operator.Not],
  [TokenKind.Less, Operator.LessThan],
  [TokenKind.LessEqual, Operator.LessThanOrEqual],
  [TokenKind.Greater, Operator.GreaterThan],
  [TokenKind.GreaterEqual, Operator.GreaterThanOrEqual],
  [TokenKind.Bar, Operator.Or],
  [TokenKind.Ampersand, Operator.And]
])

export function tokenToOperator (token: Token): Operator {
  const operator = tokenOperatorEquivalents.get(token.kind)

  if (operator === undefined) {
    throw new Error(`Token is not an operator: ${TokenKind[token.kind]}`)
  }

  return operator
}

export enum Type {
  Integer = 'integer',
  Float = 'float',
  Boolean = 'boolean',
  String = 'string',
  TemplateString = 'template_string',
}

export interface Primitive {
  kind: 'primitive'
  type: Type
  value: number | boolean | string
  offset: number
}

export interface Unary {
  kind: 'unary'
  operator: Operator
  operand: Expression
  offset: number
}

export interface Binary {
  kind: 'binary'
  operator: Operator
  left: Expression
  right: Expression
  offset: number
}

export interface Grouping {
  kind: 'grouping'
  expression: Expression
  offset: number
}

export type Expression
  = Unary
  | Binary
  | Primitive
  | Grouping

export function unary (token: Token, operand: Expression): Unary {
  return {
    kind: 'unary',
    operator: tokenToOperator(token),
    operand,
    offset: token.offset
  }
}

export function binary (
  left: Expression, token: Token, right: Expression
): Binary {
  return {
    kind: 'binary',
    left,
    operator: tokenToOperator(token),
    right,
    offset: token.offset
  }
}

export function boolean (token: Token): Primitive {
  return {
    kind: 'primitive',
    type: Type.Boolean,
    value: token.literal as boolean,
    offset: token.offset
  }
}

export function integer (token: Token): Primitive {
  return {
    kind: 'primitive',
    type: Type.Integer,
    value: token.literal as number,
    offset: token.offset
  }
}

export function float (token: Token): Primitive {
  return {
    kind: 'primitive',
    type: Type.Float,
    value: token.literal as number,
    offset: token.offset
  }
}

export function string (token: Token): Primitive {
  return {
    kind: 'primitive',
    type: Type.String,
    value: token.literal as string,
    offset: token.offset
  }
}

export function templateString (token: Token): Primitive {
  return {
    kind: 'primitive',
    type: Type.TemplateString,
    value: token.literal as string,
    offset: token.offset
  }
}

export function grouping (expression: Expression, offset: number): Grouping {
  return { kind: 'grouping', expression, offset }
}
