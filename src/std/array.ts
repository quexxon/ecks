import { TypedValue } from '../ast'
import { State } from '../types'
import XBoolean from './boolean'
import XInteger from './integer'
import XLambda from './lambda'
import XOptional from './optional'

export default class XArray {
  kind = 'array'
  #value: TypedValue[]
  #state: State

  constructor (value: TypedValue[], state: State) {
    if (value.length > 1) {
      const first = value[0]
      if (!value.every(x => x.kind === first.kind)) {
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

  drop (lambda: XLambda): XArray {
    return this.__new(this.#value.filter(v => {
      const resp = lambda.call(v)
      if (!(resp instanceof XBoolean)) {
        throw new Error('Lambda must return a boolean')
      }
      return !resp.__value
    }))
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

  get __length (): number {
    return this.#value.length
  }

  __new (value: TypedValue[]): XArray {
    return new XArray(value, this.#state)
  }

  __toString (): string {
    return `[${this.#value.map(x => x.__toString()).join(' ')}]`
  }
}
