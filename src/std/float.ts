import { TypedValue } from '../ast'
import { Type, MethodType } from '../types'
import XBoolean from './boolean'
import XInteger from './integer'

function isNumber (value: unknown): value is XInteger | XFloat {
  return value instanceof XInteger || value instanceof XFloat
}

export default class XFloat {
  kind = 'float'
  #value: number
  methods: Record<string, MethodType> = {
    int: {
      arguments: [],
      call: () => new XInteger(this.#value)
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

  constructor (value: number) {
    this.#value = value
  }

  get value (): number { return this.#value }

  add (value: TypedValue): XFloat {
    if (!isNumber(value)) throw new TypeError()
    return new XFloat(this.#value + value.value)
  }

  sub (value: TypedValue): XFloat {
    if (!isNumber(value)) throw new TypeError()
    return new XFloat(this.#value + value.value)
  }

  mult (value: TypedValue): XFloat {
    if (!isNumber(value)) throw new TypeError()
    return new XFloat(this.#value * value.value)
  }

  div (value: TypedValue): XFloat {
    if (!isNumber(value)) throw new TypeError()
    return new XFloat(this.#value / value.value)
  }

  neg (): XFloat {
    return new XFloat(-this.#value)
  }

  eq (value: TypedValue): XBoolean {
    if (!isNumber(value)) throw new TypeError()
    return new XBoolean(this.#value === value.value)
  }

  neq (value: TypedValue): XBoolean {
    if (!isNumber(value)) throw new TypeError()
    return new XBoolean(this.#value !== value.value)
  }

  lt (value: TypedValue): XBoolean {
    if (!isNumber(value)) throw new TypeError()
    return new XBoolean(this.#value < value.value)
  }

  lte (value: TypedValue): XBoolean {
    if (!isNumber(value)) throw new TypeError()
    return new XBoolean(this.#value <= value.value)
  }

  gt (value: TypedValue): XBoolean {
    if (!isNumber(value)) throw new TypeError()
    return new XBoolean(this.#value > value.value)
  }

  gte (value: TypedValue): XBoolean {
    if (!isNumber(value)) throw new TypeError()
    return new XBoolean(this.#value >= value.value)
  }

  __toString (): string {
    if (Math.trunc(this.#value) === this.#value) {
      return this.value.toString() + '.0'
    }

    return this.#value.toString()
  }
}
