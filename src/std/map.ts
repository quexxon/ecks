import { TypedValue } from '../ast'
import { State } from '../types'
import XInteger from './integer'
import XLambda from './lambda'
import XOptional from './optional'

export default class XMap {
  kind = 'map'
  #value: Map<string, TypedValue>
  #keys: Map<string, TypedValue>
  #state: State

  constructor (value: Array<[TypedValue, TypedValue]>, state: State) {
    const keys: Map<string, TypedValue> = new Map()
    const values: Map<string, TypedValue> = new Map()

    if (value.length > 0) {
      const [keyType, valType] = value[0].map(x => x.kind)
      for (const [key, val] of value) {
        if (key instanceof XLambda || key instanceof XOptional) {
          throw new TypeError()
        }

        if (key.kind !== keyType || val.kind !== valType) {
          throw new TypeError()
        }

        keys.set(key.__toString(), key)
        values.set(key.__toString(), val)
      }
    }

    this.#keys = keys
    this.#value = values
    this.#state = state
  }

  len (): XInteger {
    return new XInteger(this.#value.size, this.#state)
  }

  get (key: TypedValue): XOptional {
    if (key instanceof XLambda || key instanceof XOptional) {
      throw new TypeError()
    }

    return new XOptional(this.#state, this.#value.get(key.__toString()))
  }

  get __value (): Map<string, TypedValue> { return this.#value }
  get __keys (): Map<string, TypedValue> { return this.#keys }

  __new (value: Array<[TypedValue, TypedValue]>): XMap {
    return new XMap(value, this.#state)
  }

  __toString (): string {
    const entries = Array.from(this.#value.entries()).map(([key, value]) => {
      return `${key}: ${value.__toString()}`
    }).join(', ')

    return `{${entries}}`
  }
}
