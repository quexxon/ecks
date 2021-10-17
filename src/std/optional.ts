import { TypedValue } from '../ast'
import { Environment } from '../types'

export default class XOptional {
  kind = 'optional'
  #value?: TypedValue
  #environment: Environment

  constructor (environment: Environment, value?: TypedValue) {
    this.#environment = environment
    this.#value = value
  }

  [Symbol.for('??')] (value: TypedValue): TypedValue {
    return this.#value === undefined ? value : this.#value
  }

  get __value (): TypedValue | undefined { return this.#value }

  __new (value?: TypedValue): XOptional {
    return new XOptional(this.#environment, value)
  }

  __toString (): string {
    if (this.#value === undefined) return 'none'
    return `some(${this.#value.__toString()})`
  }
}
