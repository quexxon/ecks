import { TypedValue } from '../ast'
import { Environment } from '../types'
import XBoolean from './boolean'
import XInteger from './integer'

export default class XString {
  static #escapeString (literal: string): string {
    let start = 0
    let end = 0
    let isEscape = false
    const segments = []

    for (let i = 0; i < literal.length; i++) {
      const char = literal[i]
      if (isEscape) {
        segments.push(literal.slice(end, start))
        switch (char) {
          case 'n':
            segments.push('\n')
            end = i + 1
            break
          case 't':
            segments.push('\t')
            end = i + 1
            break
          default:
            end = i
            break
        }
        isEscape = false
      } else if (char === '\\') {
        start = i
        isEscape = true
      }
    }

    segments.push(literal.slice(end))

    return segments.join('')
  }

  kind = 'string'
  #value: string
  #environment: Environment

  constructor (value: string, environment: Environment) {
    this.#value = XString.#escapeString(value)
    this.#environment = environment
  }

  len (): XInteger {
    return new XInteger(this.__length, this.#environment)
  }

  [Symbol.for('+')] (value: TypedValue): XString {
    if (!(value instanceof XString)) throw new TypeError()
    return this.__new(this.#value + value.__value)
  }

  [Symbol.for('=')] (value: TypedValue): XBoolean {
    if (!(value instanceof XString)) throw new TypeError()
    return new XBoolean(this.#value === value.__value, this.#environment)
  }

  [Symbol.for('!=')] (value: TypedValue): XBoolean {
    if (!(value instanceof XString)) throw new TypeError()
    return new XBoolean(this.#value !== value.__value, this.#environment)
  }

  [Symbol.for('<')] (value: TypedValue): XBoolean {
    if (!(value instanceof XString)) throw new TypeError()
    return new XBoolean(this.#value < value.__value, this.#environment)
  }

  [Symbol.for('<=')] (value: TypedValue): XBoolean {
    if (!(value instanceof XString)) throw new TypeError()
    return new XBoolean(this.#value <= value.__value, this.#environment)
  }

  [Symbol.for('>')] (value: TypedValue): XBoolean {
    if (!(value instanceof XString)) throw new TypeError()
    return new XBoolean(this.#value > value.__value, this.#environment)
  }

  [Symbol.for('>=')] (value: TypedValue): XBoolean {
    if (!(value instanceof XString)) throw new TypeError()
    return new XBoolean(this.#value >= value.__value, this.#environment)
  }

  get __value (): string { return this.#value }
  get __length (): number { return this.#value.length }

  __new (value: string): XString {
    return new XString(value, this.#environment)
  }

  __toString (): string {
    if (this.#value.includes("'")) {
      return `"${this.#value}"`
    } else {
      return `'${this.#value}'`
    }
  }
}
