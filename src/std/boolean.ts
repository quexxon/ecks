import { TypedValue } from '../ast'

export default class XBoolean {
  kind = 'boolean'
  #value: boolean

  constructor (value: boolean) {
    this.#value = value
  }

  get value (): boolean { return this.#value }

  not (): XBoolean {
    return new XBoolean(!this.#value)
  }

  eq (value: TypedValue): XBoolean {
    if (!(value instanceof XBoolean)) {
      throw new TypeError()
    }

    return new XBoolean(this.#value === value.value)
  }

  __toString (): string {
    return this.#value.toString()
  }
}
