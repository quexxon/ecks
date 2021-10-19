import { Environment, Records } from './types'
import { TypedValue } from './ast'
import Interpreter from './interpreter'
import Parser from './parser'
import Scanner from './scanner'
import XArray from './std/array'
import XBoolean from './std/boolean'
import XFloat from './std/float'
import XInteger from './std/integer'
import XOptional from './std/optional'
import XSet from './std/set'
import XString from './std/string'
import XMap from './std/map'
import XRecord from './std/record'
import XTuple from './std/tuple'

interface IntegerHint {
  kind: 'integer'
  value: number
}

interface FloatHint {
  kind: 'float'
  value: number
}

interface OptionalHint {
  kind: 'optional'
  value?: unknown
}

interface RecordHint {
  kind: 'record'
  name: string
  value: Record<string, unknown>
}

interface TupleHint {
  kind: 'tuple'
  value: unknown[]
}

type TypeHint
  = IntegerHint
  | FloatHint
  | OptionalHint
  | RecordHint
  | TupleHint

function isTypeHint (value: unknown): value is TypeHint {
  if (typeof value !== 'object' || value === null) return false

  const { kind } = value as { kind: string, value?: unknown }

  return (
    typeof kind === 'string' &&
    ['integer', 'float', 'optional', 'record', 'tuple'].includes(kind)
  )
}

export default {
  eval (
    source: string,
    environment: Environment = new Map(),
    records: Records = new Map()
  ): TypedValue {
    const scanner = new Scanner(source)
    const parser = new Parser(scanner.scan(), environment)
    const interpreter = new Interpreter(parser.parse(), environment, records)
    return interpreter.eval()
  },

  fromJs (
    value: unknown,
    environment: Environment = new Map(),
    records: Records = new Map()
  ): TypedValue {
    if (typeof value === 'number') {
      if (Math.trunc(value) === value) {
        return new XInteger(value, environment)
      } else {
        return new XFloat(value, environment)
      }
    }

    if (typeof value === 'boolean') {
      return new XBoolean(value, environment)
    }

    if (typeof value === 'string') {
      return new XString(value, environment)
    }

    if (typeof value === 'undefined') {
      return new XOptional(environment)
    }

    if (Array.isArray(value)) {
      return new XArray(value.map(v => this.fromJs(v, environment)), environment)
    }

    if (value instanceof Set) {
      return new XSet(Array.from(value).map(v => this.fromJs(v, environment)), environment)
    }

    if (value instanceof Map) {
      return new XMap(Array.from(value.entries()).map(([k, v]) => {
        return [this.fromJs(k, environment), this.fromJs(v, environment)]
      }), environment)
    }

    if (isTypeHint(value)) {
      switch (value.kind) {
        case 'integer': return new XInteger(value.value, environment)
        case 'float': return new XFloat(value.value, environment)
        case 'optional': return new XOptional(environment, this.fromJs(value.value))
        case 'record': {
          const RecordType = records.get(value.name)
          if (RecordType === undefined) {
            throw new Error(`No registered record named "${value.name}`)
          }
          const members: Map<string, TypedValue> = new Map()
          for (const [k, v] of Object.entries(value.value)) {
            members.set(k, this.fromJs(v))
          }
          return new RecordType(members, environment)
        }
        case 'tuple': return new XTuple(
          value.value.map(v => this.fromJs(v, environment)),
          environment
        )
      }
    }

    throw new TypeError('Incompatible value')
  },

  toJs (value: TypedValue): any {
    if (
      value instanceof XInteger ||
      value instanceof XFloat ||
      value instanceof XString ||
      value instanceof XBoolean
    ) {
      return value.__value
    }

    if (value instanceof XOptional) {
      if (value.__value === undefined) return undefined
      return this.toJs(value.__value)
    }

    if (value instanceof XArray) {
      return value.__value.map(v => this.toJs(v))
    }

    if (value instanceof XSet) {
      return new Set(Array.from(value.__value.values()).map(v => this.toJs(v)))
    }

    if (value instanceof XTuple) {
      return value.__value.map(v => this.toJs(v))
    }

    if (value instanceof XMap) {
      return Array.from(value.__value.entries()).reduce((map, [key, val]) => {
        map.set(this.toJs(value.__keys.get(key) as TypedValue), this.toJs(val))
        return map
      }, new Map())
    }

    if (value instanceof XRecord) {
      return Array.from(value.__value.entries()).reduce<Record<string, any>>(
        (obj, [name, value]) => {
          obj[name] = this.toJs(value)
          return obj
        },
        {}
      )
    }

    throw new TypeError(`Conversion not supported for ${value.kind}`)
  }
}
