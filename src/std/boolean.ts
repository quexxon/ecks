import { TypedValue } from '../ast'
import { Environment, MethodType } from '../types'
import XString from './string'

export default class XBoolean {
  kind = 'boolean'
  #value: boolean
  #environment: Environment
  methods: Record<string, MethodType> = {
    str: {
      arguments: [],
      call: () => new XString(this.__toString(), this.#environment)
    }
  }

  constructor (value: boolean, environment: Environment) {
    this.#value = value
    this.#environment = environment
  }

  get value (): boolean { return this.#value }

  not (): XBoolean {
    return this.__new(!this.#value)
  }

  eq (value: TypedValue): XBoolean {
    if (!(value instanceof XBoolean)) throw new TypeError()
    return this.__new(this.#value === value.value)
  }

  neq (value: TypedValue): XBoolean {
    if (!(value instanceof XBoolean)) throw new TypeError()
    return this.__new(this.#value !== value.value)
  }

  or (value: TypedValue): XBoolean {
    if (!(value instanceof XBoolean)) throw new TypeError()
    return this.__new(this.#value || value.value)
  }

  and (value: TypedValue): XBoolean {
    if (!(value instanceof XBoolean)) throw new TypeError()
    return this.__new(this.#value && value.value)
  }

  __new (value: boolean): XBoolean {
    return new XBoolean(value, this.#environment)
  }

  __toString (): string {
    return this.#value.toString()
  }
}
