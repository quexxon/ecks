import { TypedValue } from '../ast'
import { State } from '../types'
import XArray from './array'
import XBoolean from './boolean'
import XInteger from './integer'
import XOptional from './optional'

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
  #state: State

  constructor (value: string, state: State) {
    this.#value = XString.#escapeString(value)
    this.#state = state
  }

  len (): XInteger {
    return new XInteger(this.__length, this.#state)
  }

  at (index: TypedValue): XOptional {
    if (!(index instanceof XInteger)) throw new TypeError('Expected an integer')
    if (index.__value < 0 || index.__value >= this.#value.length) {
      return new XOptional(this.#state)
    }
    return new XOptional(this.#state, this.__new(this.#value[index.__value]))
  }

  pad (length: TypedValue, fill: TypedValue): XString {
    if (!(length instanceof XInteger)) {
      throw new TypeError('Expected `length` to be an integer')
    }

    if (!(fill instanceof XString)) {
      throw new TypeError('Expected `fill` to be a string')
    }

    const leftWidth = Math.floor(length.__value / 2 + this.#value.length / 2)
    return this.__new(
      this.#value
        .padStart(leftWidth, fill.__value)
        .padEnd(length.__value, fill.__value)
    )
  }

  padl (length: TypedValue, fill: TypedValue): XString {
    if (!(length instanceof XInteger)) {
      throw new TypeError('Expected `length` to be an integer')
    }

    if (!(fill instanceof XString)) {
      throw new TypeError('Expected `fill` to be a string')
    }

    return this.__new(this.#value.padStart(length.__value, fill.__value))
  }

  padr (length: TypedValue, fill: TypedValue): XString {
    if (!(length instanceof XInteger)) {
      throw new TypeError('Expected `length` to be an integer')
    }

    if (!(fill instanceof XString)) {
      throw new TypeError('Expected `fill` to be a string')
    }

    return this.__new(this.#value.padEnd(length.__value, fill.__value))
  }

  trim (): XString {
    return this.__new(this.#value.trim())
  }

  triml (): XString {
    return this.__new(this.#value.trimStart())
  }

  trimr (): XString {
    return this.__new(this.#value.trimEnd())
  }

  lower (): XString {
    return this.__new(this.#value.toLocaleLowerCase())
  }

  upper (): XString {
    return this.__new(this.#value.toLocaleUpperCase())
  }

  split (delimiter: TypedValue): XArray {
    if (!(delimiter instanceof XString)) throw new TypeError('Expected a string')
    return new XArray(
      this.#value.split(delimiter.__value).map(str => new XString(str, this.#state)),
      this.#state
    )
  }

  starts (prefix: TypedValue): XBoolean {
    if (!(prefix instanceof XString)) throw new TypeError('Expected a string')
    return new XBoolean(this.#value.startsWith(prefix.__value), this.#state)
  }

  ends (suffix: TypedValue): XBoolean {
    if (!(suffix instanceof XString)) throw new TypeError('Expected a string')
    return new XBoolean(this.#value.endsWith(suffix.__value), this.#state)
  }

  has (target: TypedValue): XBoolean {
    if (!(target instanceof XString)) throw new TypeError('Expected a string')
    return new XBoolean(this.#value.includes(target.__value), this.#state)
  }

  rev (): XString {
    return this.__new(Array.from(this.#value).reverse().join(''))
  }

  [Symbol.for('+')] (value: TypedValue): XString {
    if (!(value instanceof XString)) throw new TypeError()
    return this.__new(this.#value + value.__value)
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

  get __value (): string { return this.#value }
  get __length (): number { return this.#value.length }

  __new (value: string): XString {
    return new XString(value, this.#state)
  }

  __eq (value: TypedValue): boolean {
    if (!(value instanceof XString)) throw new TypeError(`Expected ${this.kind}`)
    return this.#value === value.__value
  }

  __lt (value: TypedValue): boolean {
    if (!(value instanceof XString)) throw new TypeError(`Expected ${this.kind}`)
    return this.#value < value.__value
  }

  __gt (value: TypedValue): boolean {
    if (!(value instanceof XString)) throw new TypeError(`Expected ${this.kind}`)
    return this.#value > value.__value
  }

  __toString (): string {
    if (this.#value.includes("'")) {
      return `"${this.#value}"`
    } else {
      return `'${this.#value}'`
    }
  }
}
