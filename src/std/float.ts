import { TypedValue } from '../ast'
import { Environment } from '../types'
import XBoolean from './boolean'
import XInteger from './integer'
import XString from './string'

function isNumber (value: unknown): value is XInteger | XFloat {
  return value instanceof XInteger || value instanceof XFloat
}

export default class XFloat {
  kind = 'float'
  #value: number
  #environment: Environment

  constructor (value: number, environment: Environment) {
    this.#value = value
    this.#environment = environment
  }

  int (): XInteger {
    return new XInteger(this.#value, this.#environment)
  }

  clamp (x: XInteger | XFloat, y: XInteger | XFloat): XFloat {
    if (this.#value < x.__value) return this.__new(x.__value)
    if (this.#value > y.__value) return this.__new(y.__value)
    return this
  }

  str (): XString {
    return new XString(this.__toString(), this.#environment)
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
    return new XBoolean(this.#value === value.__value, this.#environment)
  }

  [Symbol.for('!=')] (value: TypedValue): XBoolean {
    if (!isNumber(value)) throw new TypeError()
    return new XBoolean(this.#value !== value.__value, this.#environment)
  }

  [Symbol.for('<')] (value: TypedValue): XBoolean {
    if (!isNumber(value)) throw new TypeError()
    return new XBoolean(this.#value < value.__value, this.#environment)
  }

  [Symbol.for('<=')] (value: TypedValue): XBoolean {
    if (!isNumber(value)) throw new TypeError()
    return new XBoolean(this.#value <= value.__value, this.#environment)
  }

  [Symbol.for('>')] (value: TypedValue): XBoolean {
    if (!isNumber(value)) throw new TypeError()
    return new XBoolean(this.#value > value.__value, this.#environment)
  }

  [Symbol.for('>=')] (value: TypedValue): XBoolean {
    if (!isNumber(value)) throw new TypeError()
    return new XBoolean(this.#value >= value.__value, this.#environment)
  }

  get __value (): number { return this.#value }

  __new (value: number): XFloat {
    return new XFloat(value, this.#environment)
  }

  __toString (): string {
    if (Math.trunc(this.#value) === this.#value) {
      return this.__value.toString() + '.0'
    }

    return this.#value.toString()
  }
}
