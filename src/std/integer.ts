import { TypedValue } from '../ast'
import { Environment, MethodType } from '../types'
import XBoolean from './boolean'
import XFloat from './float'

function isNumber (value: unknown): value is XInteger | XFloat {
  return value instanceof XInteger || value instanceof XFloat
}

export default class XInteger {
  kind = 'integer'
  #value: number
  #environment: Environment
  methods: Record<string, MethodType> = {
    float: {
      arguments: [],
      call: () => new XFloat(this.#value, this.#environment)
    }
  }

  constructor (value: number, environment: Environment) {
    this.#value = Math.trunc(value)
    this.#environment = environment
  }

  get value (): number { return this.#value }

  add (value: TypedValue): XInteger | XFloat {
    if (!isNumber(value)) throw new TypeError()

    const n = this.#value + value.value

    return value instanceof XFloat ? new XFloat(n, this.#environment) : this.__new(n)
  }

  sub (value: TypedValue): XInteger | XFloat {
    if (!isNumber(value)) throw new TypeError()
    const n = this.#value - value.value
    return value instanceof XFloat ? new XFloat(n, this.#environment) : this.__new(n)
  }

  mult (value: TypedValue): XInteger | XFloat {
    if (!isNumber(value)) throw new TypeError()
    const n = this.#value * value.value
    return value instanceof XFloat ? new XFloat(n, this.#environment) : this.__new(n)
  }

  div (value: TypedValue): XInteger | XFloat {
    if (!isNumber(value)) throw new TypeError()
    if (value instanceof XFloat) {
      return new XFloat(this.#value / value.value, this.#environment)
    }
    return this.__new(Math.trunc(this.#value / value.value))
  }

  neg (): XInteger {
    return this.__new(-this.#value)
  }

  eq (value: TypedValue): XBoolean {
    if (!isNumber(value)) throw new TypeError()
    return new XBoolean(this.#value === value.value, this.#environment)
  }

  neq (value: TypedValue): XBoolean {
    if (!isNumber(value)) throw new TypeError()
    return new XBoolean(this.#value !== value.value, this.#environment)
  }

  lt (value: TypedValue): XBoolean {
    if (!isNumber(value)) throw new TypeError()
    return new XBoolean(this.#value < value.value, this.#environment)
  }

  lte (value: TypedValue): XBoolean {
    if (!isNumber(value)) throw new TypeError()
    return new XBoolean(this.#value <= value.value, this.#environment)
  }

  gt (value: TypedValue): XBoolean {
    if (!isNumber(value)) throw new TypeError()
    return new XBoolean(this.#value > value.value, this.#environment)
  }

  gte (value: TypedValue): XBoolean {
    if (!isNumber(value)) throw new TypeError()
    return new XBoolean(this.#value >= value.value, this.#environment)
  }

  __new (value: number): XInteger {
    return new XInteger(value, this.#environment)
  }

  __toString (): string {
    return this.#value.toString()
  }
}
