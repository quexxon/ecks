import { TypedValue } from '../ast'
import { MethodType } from '../types'
import XInteger from './integer'

export default class XSet {
  kind = 'set'
  // TODO: Replace with a legit hash set
  #value: Map<string, TypedValue>
  methods: Record<string, MethodType> = {
    len: {
      arguments: [],
      call: () => new XInteger(this.#value.size)
    }
  }

  constructor (value: TypedValue[]) {
    if (value.length > 1) {
      const first = value[0]
      if (!value.every(x => x.kind === first.kind)) {
        throw new TypeError()
      }
    }
    this.#value = new Map(value.map(v => [v.__toString(), v]))
  }

  get __value (): Map<string, TypedValue> { return this.#value }

  get len (): number {
    return this.#value.size
  }

  add (value: TypedValue): XSet {
    return this.union(value)
  }

  union (value: TypedValue): XSet {
    if (!(value instanceof XSet)) throw new TypeError()
    if (value.len === 0) return this
    if (this.len === 0) return value
    if (value.__value.values().next().value.kind !==
      this.#value.values().next().value.kind
    ) {
      throw new TypeError()
    }
    return new XSet(
      Array.from(this.#value.values()).concat(Array.from(value.__value.values()))
    )
  }

  __toString (): string {
    return `$[${Array.from(this.#value.values()).map(x => x.__toString()).join(' ')}]`
  }
}
