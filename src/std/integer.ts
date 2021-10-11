import { TypedValue } from '../ast'
import XBoolean from './boolean'
import XFloat from './float'

export default class XInteger {
  kind = 'integer'
  #value: number

  constructor (value: number) {
    this.#value = value
  }

  get value (): number { return this.#value }

  add (value: TypedValue): XInteger | XFloat {
    if (!(value instanceof XInteger || value instanceof XFloat)) {
      throw new Error('Type Error')
    }

    const n = this.#value + value.value

    return value instanceof XFloat ? new XFloat(n) : new XInteger(n)
  }

  sub (value: TypedValue): XInteger | XFloat {
    if (!(value instanceof XInteger || value instanceof XFloat)) {
      throw new Error('Type Error')
    }

    const n = this.#value - value.value

    return value instanceof XFloat ? new XFloat(n) : new XInteger(n)
  }

  mult (value: TypedValue): XInteger | XFloat {
    if (!(value instanceof XInteger || value instanceof XFloat)) {
      throw new Error('Type Error')
    }

    const n = this.#value * value.value

    return value instanceof XFloat ? new XFloat(n) : new XInteger(n)
  }

  div (value: TypedValue): XInteger | XFloat {
    if (!(value instanceof XInteger || value instanceof XFloat)) {
      throw new Error('Type Error')
    }

    if (value instanceof XFloat) {
      return new XFloat(this.#value / value.value)
    }

    return new XInteger(Math.trunc(this.#value / value.value))
  }

  neg (): XInteger {
    return new XInteger(-this.#value)
  }

  eq (value: TypedValue): XBoolean {
    if (!(value instanceof XInteger || value instanceof XFloat)) {
      throw new TypeError()
    }

    return new XBoolean(this.#value === value.value)
  }

  __toString (): string {
    return this.#value.toString()
  }
}
