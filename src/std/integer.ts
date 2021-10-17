import { TypedValue } from '../ast'
import { Environment } from '../types'
import XBoolean from './boolean'
import XFloat from './float'
import XString from './string'

function isNumber (value: unknown): value is XInteger | XFloat {
  return value instanceof XInteger || value instanceof XFloat
}

export default class XInteger {
  kind = 'integer'
  #value: number
  #environment: Environment

  constructor (value: number, environment: Environment) {
    this.#value = Math.trunc(value)
    this.#environment = environment
  }

  float (): XFloat {
    return new XFloat(this.#value, this.#environment)
  }

  str (): XString {
    return new XString(this.__toString(), this.#environment)
  }

  [Symbol.for('neg')] (): XInteger {
    return this.__new(-this.#value)
  }

  [Symbol.for('+')] (value: TypedValue): XInteger | XFloat {
    if (!isNumber(value)) throw new TypeError()

    const n = this.#value + value.__value

    return value instanceof XFloat ? new XFloat(n, this.#environment) : this.__new(n)
  }

  [Symbol.for('-')] (value: TypedValue): XInteger | XFloat {
    if (!isNumber(value)) throw new TypeError()
    const n = this.#value - value.__value
    return value instanceof XFloat ? new XFloat(n, this.#environment) : this.__new(n)
  }

  [Symbol.for('*')] (value: TypedValue): XInteger | XFloat {
    if (!isNumber(value)) throw new TypeError()
    const n = this.#value * value.__value
    return value instanceof XFloat ? new XFloat(n, this.#environment) : this.__new(n)
  }

  [Symbol.for('/')] (value: TypedValue): XInteger | XFloat {
    if (!isNumber(value)) throw new TypeError()
    if (value instanceof XFloat) {
      return new XFloat(this.#value / value.__value, this.#environment)
    }
    return this.__new(Math.trunc(this.#value / value.__value))
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

  __new (value: number): XInteger {
    return new XInteger(value, this.#environment)
  }

  __toString (): string {
    return this.#value.toString()
  }
}
