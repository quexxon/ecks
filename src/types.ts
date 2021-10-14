import { TypedValue } from './ast'

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

export type Environment = Map<string, TypedValue>
