import { TypedValue } from '../ast'
import { State } from '../types'

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

  get __value (): TypedValue | undefined { return this.#value }

  __new (value?: TypedValue): XOptional {
    return new XOptional(this.#state, value)
  }

  __toString (): string {
    if (this.#value === undefined) return 'none'
    return `some(${this.#value.__toString()})`
  }
}
