import { TypedValue } from '../ast'
import { Environment } from '../types'
import XInteger from './integer'

export default class XTuple {
  kind = 'tuple'
  #value: TypedValue[]
  #environment: Environment

  constructor (value: TypedValue[], environment: Environment) {
    this.#value = value
    this.#environment = environment
  }

  at (index: TypedValue): TypedValue {
    if (!(index instanceof XInteger)) throw new TypeError()
    if (index.__value < 0 || index.__value >= this.#value.length) {
      throw new TypeError('Invalid index')
    }
    return this.#value[index.__value]
  }

  len (): XInteger {
    return new XInteger(this.__length, this.#environment)
  }

  get __value (): TypedValue[] { return this.#value }
  get __length (): number { return this.#value.length }

  __new (value: TypedValue[]): XTuple {
    return new XTuple(value, this.#environment)
  }

  __toString (): string {
    return `@[${this.#value.map(x => x.__toString()).join(' ')}]`
  }
}
