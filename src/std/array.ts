import { TypedValue } from '../ast'
import { State } from '../types'
import XBoolean from './boolean'
import XInteger from './integer'
import XLambda from './lambda'
import XOptional from './optional'

export default class XArray {
  kind = 'array'
  readonly __valueType?: string
  #value: TypedValue[]
  #state: State

  constructor (value: TypedValue[], state: State) {
    if (value.length > 1) {
      this.__valueType = value[0].kind
      if (!value.every(x => x.kind === this.__valueType)) {
        throw new TypeError()
      }
    }
    this.#value = value
    this.#state = state
  }

  at (index: TypedValue): XOptional {
    if (!(index instanceof XInteger)) throw new TypeError()
    const value = (index.__value >= 0 && index.__value < this.#value.length)
      ? this.#value[index.__value]
      : undefined
    return new XOptional(this.#state, value)
  }

  set (index: TypedValue, value: TypedValue): XArray {
    if (!(index instanceof XInteger)) throw new TypeError()
    if (this.__valueType !== undefined && this.__valueType !== value.kind) {
      throw new TypeError(`Expected a value of type ${this.__valueType}`)
    }

    let i = index.__value
    // Negative values of i index the end of the array
    if (i < 0) i = this.#value.length + i

    if (i >= 0 && i < this.#value.length) {
      return this.__new([
        ...this.#value.slice(0, i),
        value,
        ...this.#value.slice(i + 1)
      ])
    }

    return this
  }

  len (): XInteger {
    return new XInteger(this.#value.length, this.#state)
  }

  last (): XOptional {
    if (this.__value.length > 0) {
      return new XOptional(this.#state, this.#value[this.#value.length - 1])
    } else {
      return new XOptional(this.#state)
    }
  }

  map (lambda: XLambda): XArray {
    return this.__new(this.#value.map(v => lambda.call(v)))
  }

  keep (lambda: XLambda): XArray {
    return this.__new(this.#value.filter(v => {
      const resp = lambda.call(v)
      if (!(resp instanceof XBoolean)) {
        throw new Error('Lambda must return a boolean')
      }
      return resp.__value
    }))
  }

  fold (accumulator: TypedValue, lambda: XLambda): TypedValue {
    return this.#value.reduce((acc, v) => lambda.call(acc, v), accumulator)
  }

  drop (lambda: XLambda): XArray {
    return this.__new(this.#value.filter(v => {
      const resp = lambda.call(v)
      if (!(resp instanceof XBoolean)) {
        throw new Error('Lambda must return a boolean')
      }
      return !resp.__value
    }))
  }

  rev (): XArray {
    return this.__new([...this.#value].reverse())
  }

  find (lambda: XLambda): XOptional {
    const result = this.#value.find(v => {
      const resp = lambda.call(v)
      if (!(resp instanceof XBoolean)) {
        throw new Error('Lambda must return a boolean')
      }
      return resp.__value
    })

    if (result === undefined) return new XOptional(this.#state)
    return new XOptional(this.#state, result)
  }

  rfind (lambda: XLambda): XOptional {
    for (let i = this.#value.length - 1; i >= 0; i--) {
      const entry = this.#value[i]
      const resp = lambda.call(entry)
      if (!(resp instanceof XBoolean)) {
        throw new Error('Lambda must return a boolean')
      }
      if (resp.__value) return new XOptional(this.#state, entry)
    }
    return new XOptional(this.#state)
  }

  findi (lambda: XLambda): XOptional {
    const result = this.#value.findIndex(v => {
      const resp = lambda.call(v)
      if (!(resp instanceof XBoolean)) {
        throw new Error('Lambda must return a boolean')
      }
      return resp.__value
    })

    if (result === -1) return new XOptional(this.#state)
    return new XOptional(this.#state, new XInteger(result, this.#state))
  }

  rfindi (lambda: XLambda): XOptional {
    for (let i = this.#value.length - 1; i >= 0; i--) {
      const entry = this.#value[i]
      const resp = lambda.call(entry)
      if (!(resp instanceof XBoolean)) {
        throw new Error('Lambda must return a boolean')
      }
      if (resp.__value) {
        return new XOptional(this.#state, new XInteger(i, this.#state))
      }
    }
    return new XOptional(this.#state)
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

  [Symbol.for('+')] (value: TypedValue): XArray {
    if (!(value instanceof XArray)) throw new TypeError()
    if (value.__length === 0) return this
    if (this.__length === 0) return value
    if (value.__value[0].kind !== this.#value[0].kind) throw new TypeError()
    return this.__new(this.#value.concat(value.__value))
  }

  [Symbol.for('*')] (value: TypedValue): XArray {
    if (!(value instanceof XInteger)) throw new TypeError()
    if (value.__value < 0) throw new Error('Cannot multiply array by a negative integer')
    const array = []
    for (let n = 0; n < value.__value; n++) array.push(...this.#value)
    return this.__new(array)
  }

  get __value (): TypedValue[] { return this.#value }
  get __length (): number { return this.#value.length }

  __new (value: TypedValue[]): XArray {
    return new XArray(value, this.#state)
  }

  __eq (value: TypedValue): boolean {
    if (!(value instanceof XArray)) throw new TypeError(`Expected ${this.kind}`)
    if (this.__length !== value.__length) return false
    for (let i = 0; i < this.__length; i++) {
      if (!this.#value[i].__eq(value.__value[i])) return false
    }
    return true
  }

  __lt (value: TypedValue): boolean {
    if (!(value instanceof XArray)) throw new TypeError(`Expected ${this.kind}`)

    const limit = Math.min(this.__length, value.__length)
    for (let i = 0; i < limit; i++) {
      if (this.#value[i].__lt(value.__value[i])) return true
      if (this.#value[i].__gt(value.__value[i])) return false
    }

    return false
  }

  __gt (value: TypedValue): boolean {
    if (!(value instanceof XArray)) throw new TypeError(`Expected ${this.kind}`)

    const limit = Math.min(this.__length, value.__length)
    for (let i = 0; i < limit; i++) {
      if (this.#value[i].__gt(value.__value[i])) return true
      if (this.#value[i].__lt(value.__value[i])) return false
    }

    return false
  }

  __toString (): string {
    return `[${this.#value.map(x => x.__toString()).join(' ')}]`
  }
}
