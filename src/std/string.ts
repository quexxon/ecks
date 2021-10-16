import { TypedValue } from '../ast'
import { Environment, MethodType } from '../types'
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
  methods: Record<string, MethodType> = {
    len: {
      arguments: [],
      call: () => new XInteger(this.#value.length, this.#environment)
    }
  }

  constructor (value: string, environment: Environment) {
    this.#value = XString.#escapeString(value)
    this.#environment = environment
  }

  add (value: TypedValue): XString {
    if (!(value instanceof XString)) throw new TypeError()
    return this.__new(this.#value + value.__value)
  }

  eq (value: TypedValue): XBoolean {
    if (!(value instanceof XString)) throw new TypeError()
    return new XBoolean(this.#value === value.__value, this.#environment)
  }

  neq (value: TypedValue): XBoolean {
    if (!(value instanceof XString)) throw new TypeError()
    return new XBoolean(this.#value !== value.__value, this.#environment)
  }

  lt (value: TypedValue): XBoolean {
    if (!(value instanceof XString)) throw new TypeError()
    return new XBoolean(this.#value < value.__value, this.#environment)
  }

  lte (value: TypedValue): XBoolean {
    if (!(value instanceof XString)) throw new TypeError()
    return new XBoolean(this.#value <= value.__value, this.#environment)
  }

  gt (value: TypedValue): XBoolean {
    if (!(value instanceof XString)) throw new TypeError()
    return new XBoolean(this.#value > value.__value, this.#environment)
  }

  gte (value: TypedValue): XBoolean {
    if (!(value instanceof XString)) throw new TypeError()
    return new XBoolean(this.#value >= value.__value, this.#environment)
  }

  get __value (): string { return this.#value }

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
