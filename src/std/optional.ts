import { TypedValue } from '../ast'
import { State } from '../types'
import XBoolean from './boolean'
import XLambda from './lambda'

export default class XOptional {
  kind = 'optional'
  #value?: TypedValue
  #state: State

  constructor (state: State, value?: TypedValue) {
    this.#state = state
    this.#value = value
  }

  map (fn: TypedValue): XOptional {
    if (!(fn instanceof XLambda)) throw new TypeError('Expected a lambda')
    if (fn.__value.params.length !== 1) {
      throw new TypeError('Expected a single parameter')
    }

    if (this.#value === undefined) return this.__new()
    return this.__new(fn.call(this.#value))
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

  [Symbol.for('??')] (value: TypedValue): TypedValue {
    return this.#value === undefined ? value : this.#value
  }

  get __value (): TypedValue | undefined { return this.#value }

  __new (value?: TypedValue): XOptional {
    return new XOptional(this.#state, value)
  }

  __eq (value: TypedValue): boolean {
    if (!(value instanceof XOptional)) throw new TypeError(`Expected ${this.kind}`)
    if (this.#value === undefined && value.__value === undefined) return true
    if (this.#value === undefined || value.__value === undefined) return false
    return this.#value.__eq(value.__value)
  }

  __lt (value: TypedValue): boolean {
    if (!(value instanceof XOptional)) throw new TypeError(`Expected ${this.kind}`)
    if (this.#value === undefined && value.__value === undefined) return false
    if (this.#value === undefined || value.__value === undefined) {
      return this.#value === undefined
    }
    return this.#value.__lt(value.__value)
  }

  __gt (value: TypedValue): boolean {
    if (!(value instanceof XOptional)) throw new TypeError(`Expected ${this.kind}`)
    if (this.#value === undefined && value.__value === undefined) return false
    if (this.#value === undefined || value.__value === undefined) {
      return this.#value !== undefined
    }
    return this.#value.__gt(value.__value)
  }

  __toString (): string {
    if (this.#value === undefined) return 'none'
    return `some(${this.#value.__toString()})`
  }
}
