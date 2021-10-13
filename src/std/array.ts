import { TypedValue } from '../ast'
import { MethodType } from '../types'
import XInteger from './integer'

export default class XArray {
  kind = 'array'
  #value: TypedValue[]
  methods: Record<string, MethodType> = {
    len: {
      arguments: [],
      call: () => new XInteger(this.#value.length)
    }
  }

  constructor (value: TypedValue[]) {
    if (value.length > 1) {
      const first = value[0]
      if (!value.every(x => x.kind === first.kind)) {
        throw new TypeError()
      }
    }
    this.#value = value
  }

  get __value (): TypedValue[] { return this.#value }

  get __length (): number {
    return this.#value.length
  }

  add (value: TypedValue): XArray {
    if (!(value instanceof XArray)) throw new TypeError()
    if (value.__length === 0) return this
    if (this.__length === 0) return value
    if (value.__value[0].kind !== this.#value[0].kind) throw new TypeError()
    return new XArray(this.#value.concat(value.__value))
  }

  mult (value: TypedValue): XArray {
    if (!(value instanceof XInteger)) throw new TypeError()
    if (value.value < 0) throw new Error('Cannot multiply array by a negative integer')
    const array = []
    for (let n = 0; n < value.value; n++) array.push(...this.#value)
    return new XArray(array)
  }

  __toString (): string {
    return `[${this.#value.map(x => x.__toString()).join(' ')}]`
  }
}
