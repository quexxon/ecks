import { TypedValue } from '../ast'
import { Environment } from '../types'
import XString from './string'

export default class XBoolean {
  kind = 'boolean'
  #value: boolean
  #environment: Environment

  constructor (value: boolean, environment: Environment) {
    this.#value = value
    this.#environment = environment
  }

  str (): XString {
    return new XString(this.__toString(), this.#environment)
  }

  [Symbol.for('!')] (): XBoolean {
    return this.__new(!this.#value)
  }

  [Symbol.for('=')] (value: TypedValue): XBoolean {
    if (!(value instanceof XBoolean)) throw new TypeError()
    return this.__new(this.#value === value.__value)
  }

  [Symbol.for('!=')] (value: TypedValue): XBoolean {
    if (!(value instanceof XBoolean)) throw new TypeError()
    return this.__new(this.#value !== value.__value)
  }

  [Symbol.for('or')] (value: TypedValue): XBoolean {
    if (!(value instanceof XBoolean)) throw new TypeError()
    return this.__new(this.#value || value.__value)
  }

  [Symbol.for('and')] (value: TypedValue): XBoolean {
    if (!(value instanceof XBoolean)) throw new TypeError()
    return this.__new(this.#value && value.__value)
  }

  get __value (): boolean { return this.#value }

  __new (value: boolean): XBoolean {
    return new XBoolean(value, this.#environment)
  }

  __toString (): string {
    return this.#value.toString()
  }
}
