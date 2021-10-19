import { TypedValue } from '../ast'
import { State } from '../types'
import XBoolean from './boolean'
import XInteger from './integer'
import XString from './string'

function isNumber (value: unknown): value is XInteger | XFloat {
  return value instanceof XInteger || value instanceof XFloat
}

export default class XFloat {
  kind = 'float'
  #value: number
  #state: State

  constructor (value: number, state: State) {
    this.#value = value
    this.#state = state
  }

  int (): XInteger {
    return new XInteger(this.#value, this.#state)
  }

  clamp (x: XInteger | XFloat, y: XInteger | XFloat): XFloat {
    if (this.#value < x.__value) return this.__new(x.__value)
    if (this.#value > y.__value) return this.__new(y.__value)
    return this
  }

  str (): XString {
    return new XString(this.__toString(), this.#state)
  }

  [Symbol.for('neg')] (): XFloat {
    return this.__new(-this.#value)
  }

  [Symbol.for('+')] (value: TypedValue): XFloat {
    if (!isNumber(value)) throw new TypeError()
    return this.__new(this.#value + value.__value)
  }

  [Symbol.for('-')] (value: TypedValue): XFloat {
    if (!isNumber(value)) throw new TypeError()
    return this.__new(this.#value - value.__value)
  }

  [Symbol.for('*')] (value: TypedValue): XFloat {
    if (!isNumber(value)) throw new TypeError()
    return this.__new(this.#value * value.__value)
  }

  [Symbol.for('/')] (value: TypedValue): XFloat {
    if (!isNumber(value)) throw new TypeError()
    return this.__new(this.#value / value.__value)
  }

  [Symbol.for('=')] (value: TypedValue): XBoolean {
    if (!isNumber(value)) throw new TypeError()
    return new XBoolean(this.#value === value.__value, this.#state)
  }

  [Symbol.for('!=')] (value: TypedValue): XBoolean {
    if (!isNumber(value)) throw new TypeError()
    return new XBoolean(this.#value !== value.__value, this.#state)
  }

  [Symbol.for('<')] (value: TypedValue): XBoolean {
    if (!isNumber(value)) throw new TypeError()
    return new XBoolean(this.#value < value.__value, this.#state)
  }

  [Symbol.for('<=')] (value: TypedValue): XBoolean {
    if (!isNumber(value)) throw new TypeError()
    return new XBoolean(this.#value <= value.__value, this.#state)
  }

  [Symbol.for('>')] (value: TypedValue): XBoolean {
    if (!isNumber(value)) throw new TypeError()
    return new XBoolean(this.#value > value.__value, this.#state)
  }

  [Symbol.for('>=')] (value: TypedValue): XBoolean {
    if (!isNumber(value)) throw new TypeError()
    return new XBoolean(this.#value >= value.__value, this.#state)
  }

  get __value (): number { return this.#value }

  __new (value: number): XFloat {
    return new XFloat(value, this.#state)
  }

  __toString (): string {
    if (Math.trunc(this.#value) === this.#value) {
      return this.__value.toString() + '.0'
    }

    return this.#value.toString()
  }
}
