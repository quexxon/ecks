import { TypedValue } from '../ast'
import XBoolean from './boolean'
import XInteger from './integer'

export default class XFloat {
  kind = 'float'
  #value: number

  constructor (value: number) {
    this.#value = value
  }

  get value (): number { return this.#value }

  add (value: TypedValue): XFloat {
    if (!(value instanceof XFloat || value instanceof XInteger)) {
      throw new TypeError()
    }

    return new XFloat(this.#value + value.value)
  }

  sub (value: TypedValue): XFloat {
    if (!(value instanceof XFloat || value instanceof XInteger)) {
      throw new TypeError()
    }

    return new XFloat(this.#value + value.value)
  }

  mult (value: TypedValue): XFloat {
    if (!(value instanceof XFloat || value instanceof XInteger)) {
      throw new TypeError()
    }

    return new XFloat(this.#value * value.value)
  }

  div (value: TypedValue): XFloat {
    if (!(value instanceof XFloat || value instanceof XInteger)) {
      throw new TypeError()
    }

    return new XFloat(this.#value / value.value)
  }

  neg (): XFloat {
    return new XFloat(-this.#value)
  }

  eq (value: TypedValue): XBoolean {
    if (!(value instanceof XInteger || value instanceof XFloat)) {
      throw new TypeError()
    }

    return new XBoolean(this.#value === value.value)
  }

  __toString (): string {
    if (Math.trunc(this.#value) === this.#value) {
      return this.value.toString() + '.0'
    }

    return this.#value.toString()
  }
}
