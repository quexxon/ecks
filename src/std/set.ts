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
    value.sort((x, y) => {
      if (x.__lt(y)) return -1
      if (x.__gt(y)) return 1
      return 0
    })
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

  [Symbol.for('=')] (value: TypedValue): XBoolean {
    return new XBoolean(this.__eq(value), this.#state)
  }

  [Symbol.for('!=')] (value: TypedValue): XBoolean {
    return new XBoolean(!this.__eq(value), this.#state)
  }

  [Symbol.for('<')] (value: TypedValue): XBoolean {
    return new XBoolean(this.__lt(value), this.#state)
  }

  [Symbol.for('<=')] (value: TypedValue): XBoolean {
    return new XBoolean(this.__lt(value) || this.__eq(value), this.#state)
  }

  [Symbol.for('>')] (value: TypedValue): XBoolean {
    return new XBoolean(this.__gt(value), this.#state)
  }

  [Symbol.for('>=')] (value: TypedValue): XBoolean {
    return new XBoolean(this.__gt(value) || this.__eq(value), this.#state)
  }

  get __value (): Map<string, TypedValue> { return this.#value }
  get __length (): number { return this.#value.size }

  __new (value: TypedValue[]): XSet {
    return new XSet(value, this.#state)
  }

  __eq (value: TypedValue): boolean {
    if (!(value instanceof XSet)) throw new TypeError(`Expected ${this.kind}`)

    if (this.__length !== value.__length) return false

    const v1 = Array.from(this.#value.values())
    const v2 = Array.from(value.__value.values())
    for (let i = 0; i < this.__length; i++) {
      if (!v1[i].__eq(v2[i])) return false
    }

    return true
  }

  __lt (value: TypedValue): boolean {
    if (!(value instanceof XSet)) throw new TypeError(`Expected ${this.kind}`)

    const v1 = Array.from(this.#value.values())
    const v2 = Array.from(value.__value.values())
    const limit = Math.min(this.#value.size, value.__value.size)

    for (let i = 0; i < limit; i++) {
      if (v1[i].__lt(v2[i])) return true
      if (v1[i].__gt(v2[i])) return false
    }

    return this.__length < value.__length
  }

  __gt (value: TypedValue): boolean {
    if (!(value instanceof XSet)) throw new TypeError(`Expected ${this.kind}`)

    const v1 = Array.from(this.#value.values())
    const v2 = Array.from(value.__value.values())
    const limit = Math.min(this.#value.size, value.__value.size)

    for (let i = 0; i < limit; i++) {
      if (v1[i].__gt(v2[i])) return true
      if (v1[i].__lt(v2[i])) return false
    }

    return this.__length > value.__length
  }

  __toString (): string {
    const values = Array.from(this.#value.values())
    return `$[${values.map(x => x.__toString()).join(' ')}]`
  }
}
