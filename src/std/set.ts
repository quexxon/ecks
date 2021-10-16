import { TypedValue } from '../ast'
import { Environment, MethodType } from '../types'
import XBoolean from './boolean'
import XInteger from './integer'
import XLambda from './lambda'

export default class XSet {
  kind = 'set'
  // TODO: Replace with a legit hash set
  #value: Map<string, TypedValue>
  #environment: Environment
  methods: Record<string, MethodType> = {
    len: {
      arguments: [],
      call: () => new XInteger(this.#value.size, this.#environment)
    },
    has: {
      arguments: [],
      call: (value: TypedValue): XBoolean => {
        if (value instanceof XLambda) {
          throw new TypeError()
        }

        return new XBoolean(this.#value.has(value.__toString()), this.#environment)
      }
    }
  }

  constructor (value: TypedValue[], environment: Environment) {
    if (value.length > 1) {
      const first = value[0]
      if (!value.every(x => x.kind === first.kind)) {
        throw new TypeError()
      }
    }
    this.#value = new Map(value.map(v => [v.__toString(), v]))
    this.#environment = environment
  }

  get len (): number {
    return this.#value.size
  }

  add (value: TypedValue): XSet {
    return this.union(value)
  }

  union (value: TypedValue): XSet {
    if (!(value instanceof XSet)) throw new TypeError()
    if (value.len === 0) return this
    if (this.len === 0) return value
    if (value.__value.values().next().value.kind !==
      this.#value.values().next().value.kind
    ) {
      throw new TypeError()
    }
    return this.__new(
      Array.from(this.#value.values()).concat(Array.from(value.__value.values()))
    )
  }

  get __value (): Map<string, TypedValue> { return this.#value }

  __new (value: TypedValue[]): XSet {
    return new XSet(value, this.#environment)
  }

  __toString (): string {
    return `$[${Array.from(this.#value.values()).map(x => x.__toString()).join(' ')}]`
  }
}
