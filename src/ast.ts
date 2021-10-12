import XArray from './std/array'
import XBoolean from './std/boolean'
import XFloat from './std/float'
import XInteger from './std/integer'
import XSet from './std/set'
import XString from './std/string'
import XTemplateString from './std/templateString'
import Token, { TokenKind } from './token'

export enum UnaryOperator {
  Negation = '-',
  Not = '!',
}

export enum BinaryOperator {
  Addition = '+',
  Subtraction = '-',
  Multiplication = '*',
  Division = '/',
  Equal = '=',
  NotEqual = '!=',
  LessThan = '<',
  LessThanOrEqual = '<=',
  GreaterThan = '>',
  GreaterThanOrEqual = '>=',
  Or = '|',
  And = '&',
}

const TOKEN_TO_UNARY_OP = new Map([
  [TokenKind.Minus, UnaryOperator.Negation],
  [TokenKind.Bang, UnaryOperator.Not]
])

const TOKEN_TO_BINARY_OP = new Map([
  [TokenKind.Plus, BinaryOperator.Addition],
  [TokenKind.Minus, BinaryOperator.Subtraction],
  [TokenKind.Star, BinaryOperator.Multiplication],
  [TokenKind.Slash, BinaryOperator.Division],
  [TokenKind.Equal, BinaryOperator.Equal],
  [TokenKind.BangEqual, BinaryOperator.NotEqual],
  [TokenKind.Less, BinaryOperator.LessThan],
  [TokenKind.LessEqual, BinaryOperator.LessThanOrEqual],
  [TokenKind.Greater, BinaryOperator.GreaterThan],
  [TokenKind.GreaterEqual, BinaryOperator.GreaterThanOrEqual],
  [TokenKind.Bar, BinaryOperator.Or],
  [TokenKind.Ampersand, BinaryOperator.And]
])

export function tokenToUnaryOperator (token: Token): UnaryOperator {
  const operator = TOKEN_TO_UNARY_OP.get(token.kind)

  if (operator === undefined) {
    throw new Error(`Token is not an operator: ${TokenKind[token.kind]}`)
  }

  return operator
}

export function tokenToBinaryOperator (token: Token): BinaryOperator {
  const operator = TOKEN_TO_BINARY_OP.get(token.kind)

  if (operator === undefined) {
    throw new Error(`Token is not an operator: ${TokenKind[token.kind]}`)
  }

  return operator
}

export type TypedValue
  = XInteger
  | XFloat
  | XBoolean
  | XString
  | XTemplateString
  | XArray
  | XSet

export interface Primitive {
  kind: 'primitive'
  value: TypedValue
  offset: number
}

export interface Unary {
  kind: 'unary'
  operator: UnaryOperator
  operand: Expression
  offset: number
}

export interface Binary {
  kind: 'binary'
  operator: BinaryOperator
  left: Expression
  right: Expression
  offset: number
}

export interface Grouping {
  kind: 'grouping'
  expression: Expression
  offset: number
}

export interface ArrayGroup {
  kind: 'array'
  elements: Expression[]
  offset: number
}

export interface SetGroup {
  kind: 'set'
  elements: Expression[]
  offset: number
}

export type Expression
  = Unary
  | Binary
  | Primitive
  | Grouping
  | ArrayGroup
  | SetGroup

export function unary (token: Token, operand: Expression): Unary {
  return {
    kind: 'unary',
    operator: tokenToUnaryOperator(token),
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
    operator: tokenToBinaryOperator(token),
    right,
    offset: token.offset
  }
}

export function boolean (token: Token): Primitive {
  return {
    kind: 'primitive',
    value: new XBoolean(token.literal as boolean),
    offset: token.offset
  }
}

export function integer (token: Token): Primitive {
  return {
    kind: 'primitive',
    value: new XInteger(token.literal as number),
    offset: token.offset
  }
}

export function float (token: Token): Primitive {
  return {
    kind: 'primitive',
    value: new XFloat(token.literal as number),
    offset: token.offset
  }
}

export function string (token: Token): Primitive {
  return {
    kind: 'primitive',
    value: new XString(token.literal as string),
    offset: token.offset
  }
}

export function templateString (token: Token): Primitive {
  return {
    kind: 'primitive',
    value: new XTemplateString(token.literal as string),
    offset: token.offset
  }
}

export function grouping (expression: Expression, offset: number): Grouping {
  return { kind: 'grouping', expression, offset }
}

export function array (elements: Expression[], offset: number): ArrayGroup {
  return { kind: 'array', elements, offset }
}

export function set (elements: Expression[], offset: number): SetGroup {
  return { kind: 'set', elements, offset }
}
