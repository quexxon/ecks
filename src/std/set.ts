import { TypedValue } from '../ast'
import { State } from '../types'
import XBoolean from './boolean'
import XInteger from './integer'
import XLambda from './lambda'

export default class XSet {
  kind = 'set'
  #value: Map<string, TypedValue>
  #state: State

  constructor (value: TypedValue[], state: State) {
    if (value.length > 1) {
      const first = value[0]
      if (!value.every(x => x.kind === first.kind)) {
        throw new TypeError()
      }
    }
    this.#value = new Map(value.map(v => [v.__toString(), v]))
    this.#state = state
  }

  has (value: TypedValue): XBoolean {
    if (value instanceof XLambda) {
      throw new TypeError()
    }

    return new XBoolean(this.#value.has(value.__toString()), this.#state)
  }

  len (): XInteger {
    return new XInteger(this.__length, this.#state)
  }

  union (value: TypedValue): XSet {
    if (!(value instanceof XSet)) throw new TypeError()
    if (value.__length === 0) return this
    if (this.__length === 0) return value
    if (value.__value.values().next().value.kind !==
      this.#value.values().next().value.kind
    ) {
      throw new TypeError()
    }
    return this.__new(
      Array.from(this.#value.values()).concat(Array.from(value.__value.values()))
    )
  }

  [Symbol.for('+')] (value: TypedValue): XSet {
    return this.union(value)
  }

  get __value (): Map<string, TypedValue> { return this.#value }

  get __length (): number {
    return this.#value.size
  }

  __new (value: TypedValue[]): XSet {
    return new XSet(value, this.#state)
  }

  __toString (): string {
    return `$[${Array.from(this.#value.values()).map(x => x.__toString()).join(' ')}]`
  }
}
