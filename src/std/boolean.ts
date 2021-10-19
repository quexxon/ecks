import { TypedValue } from '../ast'
import { State } from '../types'
import XString from './string'

export default class XBoolean {
  kind = 'boolean'
  #value: boolean
  #state: State

  constructor (value: boolean, state: State) {
    this.#value = value
    this.#state = state
  }

  str (): XString {
    return new XString(this.__toString(), this.#state)
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
    return new XBoolean(value, this.#state)
  }

  __toString (): string {
    return this.#value.toString()
  }
}
