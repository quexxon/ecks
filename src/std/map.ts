import { TypedValue } from '../ast'
import Interpreter from '../interpreter'
import Parser from '../parser'
import Scanner from '../scanner'
import { Environment, MethodType } from '../types'
import XInteger from './integer'
import XLambda from './lambda'
import XOptional from './optional'

export default class XMap {
  kind = 'map'
  // TODO: Replace with a legit hash map
  #value: Map<string, TypedValue>
  #environment: Environment
  methods: Record<string, MethodType> = {
    len: {
      arguments: [],
      call: () => new XInteger(this.#value.size, this.#environment)
    },
    get: {
      arguments: [],
      call: (key: TypedValue): XOptional => {
        if (key instanceof XLambda || key instanceof XOptional) {
          throw new TypeError()
        }

        return new XOptional(this.#environment, this.#value.get(key.__toString()))
      }
    }
  }

  constructor (
    value: Array<[TypedValue, TypedValue]>,
    environment: Environment
  ) {
    const map: Map<string, TypedValue> = new Map()

    if (value.length > 0) {
      const [keyType, valType] = value[0].map(x => x.kind)
      for (const [key, val] of value) {
        if (key instanceof XLambda || key instanceof XOptional) {
          throw new TypeError()
        }

        if (key.kind !== keyType || val.kind !== valType) {
          throw new TypeError()
        }

        map.set(key.__toString(), val)
      }
    }

    this.#value = map
    this.#environment = environment
  }

  get __value (): Map<string, TypedValue> { return this.#value }

  __new (value: Map<string, TypedValue>): XMap {
    const entries: Array<[TypedValue, TypedValue]> = []
    for (const [key, value] of this.#value) {
      const scanner = new Scanner(key)
      const parser = new Parser(scanner.scan(), this.#environment)
      const interpreter = new Interpreter(parser.parse(), this.#environment)
      entries.push([interpreter.eval(), value])
    }
    return new XMap(entries, this.#environment)
  }

  __toString (): string {
    const entries = Array.from(this.#value.entries()).map(([key, value]) => {
      return `${key}: ${value.__toString()}`
    }).join(', ')

    return `{${entries}}`
  }
}
