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
    // TypeScript bug: Symbols cannot be used to index class
    // Ref: https://github.com/microsoft/TypeScript/issues/38009
    interface EqOperand { [key: symbol]: (r: any) => XBoolean }

    let isEqual
    if (this.#value === undefined && value.__value === undefined) {
      isEqual = true
    } else if (this.#value === undefined || value.__value === undefined) {
      isEqual = false
    } else {
      isEqual = ((this.#value as object) as EqOperand)[Symbol.for('=')](value.__value).__value
    }

    return new XBoolean(isEqual, this.#state)
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
