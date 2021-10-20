import { TypedValue } from '../ast'
import { State } from '../types'
import XLambda from './lambda'

export default class XOptional {
  kind = 'optional'
  #value?: TypedValue
  #state: State

  constructor (state: State, value?: TypedValue) {
    this.#state = state
    this.#value = value
  }

  [Symbol.for('??')] (value: TypedValue): TypedValue {
    return this.#value === undefined ? value : this.#value
  }

  map (fn: TypedValue): XOptional {
    if (!(fn instanceof XLambda)) throw new TypeError('Expected a lambda')
    if (fn.__value.params.length !== 1) {
      throw new TypeError('Expected a single parameter')
    }

    if (this.#value === undefined) return this.__new()
    return this.__new(fn.call(this.#value))
  }

  get __value (): TypedValue | undefined { return this.#value }

  __new (value?: TypedValue): XOptional {
    return new XOptional(this.#state, value)
  }

  __toString (): string {
    if (this.#value === undefined) return 'none'
    return `some(${this.#value.__toString()})`
  }
}
