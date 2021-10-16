import XArray from './std/array'
import XBoolean from './std/boolean'
import XFloat from './std/float'
import XInteger from './std/integer'
import XLambda from './std/lambda'
import XOptional from './std/optional'
import XSet from './std/set'
import XString from './std/string'
import XTemplateString from './std/templateString'
import Token, { TokenKind } from './token'
import { Environment } from './types'

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
  Optional = '??',
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
  [TokenKind.Or, BinaryOperator.Or],
  [TokenKind.And, BinaryOperator.And],
  [TokenKind.DoubleQuestion, BinaryOperator.Optional]
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
  | XLambda
  | XOptional

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

export interface Ternary {
  kind: 'ternary'
  antecedent: Expression
  consequent: Expression
  alternative: Expression
}

export interface Cond {
  kind: 'cond'
  branches: Array<[Expression, Expression]>
  else?: Expression
}

export interface Case {
  kind: 'case'
  target: Expression
  branches: Array<[Expression, Expression]>
  else?: Expression
}

export interface Let {
  kind: 'let'
  bindings: Array<[Identifier, Expression]>
  body: Expression
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

export interface MethodCall {
  kind: 'method-call'
  receiver: Expression
  identifier: Identifier
  arguments: Expression[]
  offset: number
}

export interface Identifier {
  kind: 'identifier'
  name: string
  offset: number
}

export interface Lambda {
  kind: 'lambda'
  parameters: Identifier[]
  body: Expression
  offset: number
}

export type Expression
  = Unary
  | Binary
  | Ternary
  | Cond
  | Case
  | Let
  | Primitive
  | Grouping
  | ArrayGroup
  | SetGroup
  | MethodCall
  | Lambda
  | Identifier

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

export function ternary (
  antecedent: Expression,
  consequent: Expression,
  alternative: Expression
): Ternary {
  return { kind: 'ternary', antecedent, consequent, alternative }
}

export function cond (
  branches: Array<[Expression, Expression]>,
  alternative?: Expression
): Cond {
  return { kind: 'cond', branches, else: alternative }
}

export function case_ (
  target: Expression,
  branches: Array<[Expression, Expression]>,
  alternative?: Expression
): Case {
  return { kind: 'case', target, branches, else: alternative }
}

export function let_ (
  bindings: Array<[Identifier, Expression]>,
  body: Expression
): Let {
  return { kind: 'let', bindings, body }
}

export function boolean (token: Token, environment: Environment): Primitive {
  return {
    kind: 'primitive',
    value: new XBoolean(token.literal as boolean, environment),
    offset: token.offset
  }
}

export function integer (token: Token, environment: Environment): Primitive {
  return {
    kind: 'primitive',
    value: new XInteger(token.literal as number, environment),
    offset: token.offset
  }
}

export function float (token: Token, environment: Environment): Primitive {
  return {
    kind: 'primitive',
    value: new XFloat(token.literal as number, environment),
    offset: token.offset
  }
}

export function string (token: Token, environment: Environment): Primitive {
  return {
    kind: 'primitive',
    value: new XString(token.literal as string, environment),
    offset: token.offset
  }
}

export function templateString (token: Token, environment: Environment): Primitive {
  return {
    kind: 'primitive',
    value: new XTemplateString(token.literal as string, environment),
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

export function identifier (token: Token): Identifier {
  return { kind: 'identifier', name: token.lexeme, offset: token.offset }
}

export function methodCall (
  receiver: Expression,
  token: Token,
  args: Expression[],
  offset: number
): MethodCall {
  return {
    kind: 'method-call',
    receiver,
    identifier: identifier(token),
    arguments: args,
    offset
  }
}

export function lambda (
  parameters: Identifier[],
  body: Expression,
  offset: number
): Lambda {
  return { kind: 'lambda', parameters, body, offset }
}
