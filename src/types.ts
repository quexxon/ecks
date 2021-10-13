export interface MethodType {
  arguments: PrimitiveType[]
  call: Function
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

export const Type: Record<string, PrimitiveType> = {
  integer: { kind: 'integer' },
  float: { kind: 'float' }
}
