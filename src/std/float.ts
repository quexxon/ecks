import { TypedValue } from '../ast'
import { Type, MethodType, Environment } from '../types'
import XBoolean from './boolean'
import XInteger from './integer'

function isNumber (value: unknown): value is XInteger | XFloat {
  return value instanceof XInteger || value instanceof XFloat
}

export default class XFloat {
  kind = 'float'
  #value: number
  #environment: Environment
  methods: Record<string, MethodType> = {
    int: {
      arguments: [],
      call: () => new XInteger(this.#value, this.#environment)
    },
    clamp: {
      arguments: [
        Type.float,
        Type.float
      ],
      call: (x: XFloat, y: XFloat) => {
        if (this.#value < x.value) return x
        if (this.#value > y.value) return y
        return this
      }
    }
  }

  constructor (value: number, environment: Environment) {
    this.#value = value
    this.#environment = environment
  }

  get value (): number { return this.#value }

  add (value: TypedValue): XFloat {
    if (!isNumber(value)) throw new TypeError()
    return this.__new(this.#value + value.value)
  }

  sub (value: TypedValue): XFloat {
    if (!isNumber(value)) throw new TypeError()
    return this.__new(this.#value + value.value)
  }

  mult (value: TypedValue): XFloat {
    if (!isNumber(value)) throw new TypeError()
    return this.__new(this.#value * value.value)
  }

  div (value: TypedValue): XFloat {
    if (!isNumber(value)) throw new TypeError()
    return this.__new(this.#value / value.value)
  }

  neg (): XFloat {
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

  __new (value: number): XFloat {
    return new XFloat(value, this.#environment)
  }

  __toString (): string {
    if (Math.trunc(this.#value) === this.#value) {
      return this.value.toString() + '.0'
    }

    return this.#value.toString()
  }
}
