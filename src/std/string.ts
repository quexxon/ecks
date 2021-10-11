import { TypedValue } from '../ast'
import XBoolean from './boolean'

export default class XString {
  kind = 'string'
  #value: string

  constructor (value: string) {
    this.#value = value
  }

  get value (): string { return this.#value }

  add (value: TypedValue): XString {
    if (!(value instanceof XString)) throw new TypeError()
    return new XString(this.#value + value.value)
  }

  eq (value: TypedValue): XBoolean {
    if (!(value instanceof XString)) throw new TypeError()
    return new XBoolean(this.#value === value.value)
  }

  neq (value: TypedValue): XBoolean {
    if (!(value instanceof XString)) throw new TypeError()
    return new XBoolean(this.#value !== value.value)
  }

  lt (value: TypedValue): XBoolean {
    if (!(value instanceof XString)) throw new TypeError()
    return new XBoolean(this.#value < value.value)
  }

  lte (value: TypedValue): XBoolean {
    if (!(value instanceof XString)) throw new TypeError()
    return new XBoolean(this.#value <= value.value)
  }

  gt (value: TypedValue): XBoolean {
    if (!(value instanceof XString)) throw new TypeError()
    return new XBoolean(this.#value > value.value)
  }

  gte (value: TypedValue): XBoolean {
    if (!(value instanceof XString)) throw new TypeError()
    return new XBoolean(this.#value >= value.value)
  }

  __toString (): string {
    return this.#value.toString()
  }
}
