import XArray from './std/array.ts'
import XBoolean from './std/boolean.ts'
import XFloat from './std/float.ts'
import XInteger from './std/integer.ts'
import XLambda from './std/lambda.ts'
import XMap from './std/map.ts'
import XOptional from './std/optional.ts'
import XRecord from './std/record.ts'
import { XDate } from './std/date.ts'
import XSet from './std/set.ts'
import XString from './std/string.ts'
import XTemplateString from './std/templateString.ts'
import XTuple from './std/tuple.ts'
import Token, { TokenKind } from './token.ts'
import { State } from './types.ts'

export enum UnaryOperator {
  Negation = '-',
  Not = '!',
}

export enum BinaryOperator {
  Addition = '+',
  Subtraction = '-',
  Multiplication = '*',
  Division = '/',
  Modulo = '%',
  Exponent = '^',
  Equal = '=',
  NotEqual = '!=',
  LessThan = '<',
  LessThanOrEqual = '<=',
  GreaterThan = '>',
  GreaterThanOrEqual = '>=',
  Or = 'or',
  And = 'and',
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
  [TokenKind.Percent, BinaryOperator.Modulo],
  [TokenKind.Caret, BinaryOperator.Exponent],
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
  | XDate
  | XSet
  | XTuple
  | XMap
  | XLambda
  | XOptional
  | XRecord

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

export interface TupleGroup {
  kind: 'tuple'
  elements: Expression[]
  offset: number
}

export interface MapGroup {
  kind: 'map'
  elements: Array<[Expression, Expression]>
  offset: number
}

export interface RecordGroup {
  kind: 'record'
  name: string
  members: Array<[Identifier, Expression]>
  offset: number
}

export interface MethodCall {
  kind: 'method-call'
  receiver: Expression
  identifier: Identifier
  arguments: Expression[]
  offset: number
}

export interface Index {
  kind: 'index'
  receiver: Expression
  index: Expression
  offset: number
}

export interface Optional {
  kind: 'optional'
  value?: Expression
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
  | TupleGroup
  | MapGroup
  | RecordGroup
  | MethodCall
  | Index
  | Lambda
  | Optional
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

export function boolean (token: Token, state: State): Primitive {
  return {
    kind: 'primitive',
    value: new XBoolean(token.literal as boolean, state),
    offset: token.offset
  }
}

export function integer (token: Token, state: State): Primitive {
  return {
    kind: 'primitive',
    value: new XInteger(token.literal as number, state),
    offset: token.offset
  }
}

export function float (token: Token, state: State): Primitive {
  return {
    kind: 'primitive',
    value: new XFloat(token.literal as number, state),
    offset: token.offset
  }
}

export function string (token: Token, state: State): Primitive {
  return {
    kind: 'primitive',
    value: new XString(token.literal as string, state),
    offset: token.offset
  }
}

export function templateString (token: Token, state: State): Primitive {
  return {
    kind: 'primitive',
    value: new XTemplateString(token.literal as string, state),
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

export function tuple (elements: Expression[], offset: number): TupleGroup {
  return { kind: 'tuple', elements, offset }
}

export function map (elements: Array<[Expression, Expression]>, offset: number): MapGroup {
  return { kind: 'map', elements, offset }
}

export function record (
  token: Token,
  members: Array<[Identifier, Expression]>
): RecordGroup {
  return { kind: 'record', name: token.lexeme, members, offset: token.offset }
}

export function optional (offset: number, value?: Expression): Optional {
  return { kind: 'optional', value, offset }
}

export function identifier (token: Token): Identifier {
  return { kind: 'identifier', name: token.lexeme.toLowerCase(), offset: token.offset }
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

export function index (receiver: Expression, index: Expression, offset: number): Index {
  return { kind: 'index', receiver, index, offset }
}

export function lambda (
  parameters: Identifier[],
  body: Expression,
  offset: number
): Lambda {
  return { kind: 'lambda', parameters, body, offset }
}

export function toString (expr: Expression): string {
  switch (expr.kind) {
    case 'unary':
      return `${expr.operator}${toString(expr.operand)}`
    case 'binary':
      return `${toString(expr.left)} ${expr.operator} ${toString(expr.right)}`
    case 'ternary':
      return `${toString(expr.antecedent)} ? ${toString(expr.consequent)} : ${toString(expr.alternative)}`
    case 'cond': {
      const branches = expr.branches.map(([antecedent, consequent]) => {
        return `${toString(antecedent)}: ${toString(consequent)}`
      }).join(', ')
      const elseBranch = expr.else === undefined ? '' : `else: ${toString(expr.else)}`
      let body = ''
      if (branches !== '' && elseBranch !== '') {
        body = `${branches}, ${elseBranch}`
      } else if (branches !== '') {
        body = branches
      } else if (elseBranch !== '') {
        body = elseBranch
      }
      return `cond {${body}}`
    }
    case 'case': {
      const branches = expr.branches.map(([case_, expression]) => {
        return `${toString(case_)}: ${toString(expression)}`
      }).join(', ')
      const elseBranch = expr.else === undefined ? '' : `else: ${toString(expr.else)}`
      let body = ''
      if (branches !== '' && elseBranch !== '') {
        body = `${branches}, ${elseBranch}`
      } else if (branches !== '') {
        body = branches
      } else if (elseBranch !== '') {
        body = elseBranch
      }
      return `case ${toString(expr.target)} {${body}}`
    }
    case 'let': {
      const bindings = expr.bindings.map(([identifier, expression]) => {
        return `${toString(identifier)}: ${toString(expression)}`
      }).join(', ')
      return `let {${bindings}} ${toString(expr.body)}`
    }
    case 'primitive': return expr.value.__toString()
    case 'grouping': return `(${toString(expr.expression)})`
    case 'array': return `[${expr.elements.map(toString).join(' ')}]`
    case 'set': return `$[${expr.elements.map(toString).join(' ')}]`
    case 'tuple': return `@[${expr.elements.map(toString).join(' ')}]`
    case 'map': {
      const entries = expr.elements.map(([k, v]) => {
        return `${toString(k)}: ${toString(v)}`
      }).join(', ')
      return `{${entries}}`
    }
    case 'record': {
      const members = expr.members.map(([name, value]) => {
        return `${toString(name)}: ${toString(value)}`
      }).join(', ')
      return `${expr.name} {${members}}`
    }
    case 'method-call': {
      const args = expr.arguments.length === 0
        ? ''
        : `(${expr.arguments.map(toString).join(', ')})`
      return `${toString(expr.receiver)}.${toString(expr.identifier)}${args}`
    }
    case 'index': return `${toString(expr.receiver)}.${toString(expr.index)}`
    case 'lambda':
      return `|${expr.parameters.map(toString).join(' ')}| ${toString(expr.body)}`
    case 'optional':
      return expr.value === undefined ? 'none' : `some(${toString(expr.value)})`
    case 'identifier': return expr.name
  }
}
