import { TypedValue } from '../ast'
import { Environment, MethodType } from '../types'
import XBoolean from './boolean'
import XInteger from './integer'

export default class XString {
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
    this.#value = value
    this.#environment = environment
  }

  get value (): string { return this.#value }

  add (value: TypedValue): XString {
    if (!(value instanceof XString)) throw new TypeError()
    return this.__new(this.#value + value.value)
  }

  eq (value: TypedValue): XBoolean {
    if (!(value instanceof XString)) throw new TypeError()
    return new XBoolean(this.#value === value.value, this.#environment)
  }

  neq (value: TypedValue): XBoolean {
    if (!(value instanceof XString)) throw new TypeError()
    return new XBoolean(this.#value !== value.value, this.#environment)
  }

  lt (value: TypedValue): XBoolean {
    if (!(value instanceof XString)) throw new TypeError()
    return new XBoolean(this.#value < value.value, this.#environment)
  }

  lte (value: TypedValue): XBoolean {
    if (!(value instanceof XString)) throw new TypeError()
    return new XBoolean(this.#value <= value.value, this.#environment)
  }

  gt (value: TypedValue): XBoolean {
    if (!(value instanceof XString)) throw new TypeError()
    return new XBoolean(this.#value > value.value, this.#environment)
  }

  gte (value: TypedValue): XBoolean {
    if (!(value instanceof XString)) throw new TypeError()
    return new XBoolean(this.#value >= value.value, this.#environment)
  }

  __new (value: string): XString {
    return new XString(value, this.#environment)
  }

  __toString (): string {
    return this.#value.toString()
  }
}
