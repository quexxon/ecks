import { TypedValue } from './ast.ts'
import XRecord from './std/record.ts'

export interface MethodType {
  arguments: PrimitiveType[]
  call: Function
}

export interface LambdaType {
  kind: 'lambda'
}

export interface IntegerType {
  kind: 'integer'
}

export interface FloatType {
  kind: 'float'
}

export type PrimitiveType
  = IntegerType
  | FloatType
  | LambdaType

export const Type: Record<string, PrimitiveType> = {
  integer: { kind: 'integer' },
  float: { kind: 'float' }
}

export interface State {
  environment: Environment
  records: Records
}

export type Environment = Map<string, TypedValue>

export type Records = Map<string, new (value: Map<string, TypedValue>, state: State) => XRecord>
