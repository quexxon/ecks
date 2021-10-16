import { TypedValue } from '../ast'
import { Environment, MethodType } from '../types'
import XBoolean from './boolean'
import XInteger from './integer'
import XLambda from './lambda'
import XOptional from './optional'

export default class XArray {
  kind = 'array'
  #value: TypedValue[]
  #environment: Environment
  methods: Record<string, MethodType> = {
    at: {
      arguments: [{ kind: 'integer' }],
      call: (index: XInteger) => {
        const value = (index.__value >= 0 && index.__value < this.#value.length)
          ? this.#value[index.__value]
          : undefined
        return new XOptional(this.#environment, value)
      }
    },
    len: {
      arguments: [],
      call: () => new XInteger(this.#value.length, this.#environment)
    },
    map: {
      arguments: [
        { kind: 'lambda' }
      ],
      call: (lambda: XLambda) => {
        return this.__new(this.#value.map(v => lambda.call(v)))
      }
    },
    keep: {
      arguments: [
        { kind: 'lambda' }
      ],
      call: (lambda: XLambda) => {
        return this.__new(this.#value.filter(v => {
          const resp = lambda.call(v)
          if (!(resp instanceof XBoolean)) {
            throw new Error('Lambda must return a boolean')
          }
          return resp.__value
        }))
      }
    },
    drop: {
      arguments: [
        { kind: 'lambda' }
      ],
      call: (lambda: XLambda) => {
        return this.__new(this.#value.filter(v => {
          const resp = lambda.call(v)
          if (!(resp instanceof XBoolean)) {
            throw new Error('Lambda must return a boolean')
          }
          return !resp.__value
        }))
      }
    }
  }

  constructor (value: TypedValue[], environment: Environment) {
    if (value.length > 1) {
      const first = value[0]
      if (!value.every(x => x.kind === first.kind)) {
        throw new TypeError()
      }
    }
    this.#value = value
    this.#environment = environment
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
    return this.__new(this.#value.concat(value.__value))
  }

  mult (value: TypedValue): XArray {
    if (!(value instanceof XInteger)) throw new TypeError()
    if (value.__value < 0) throw new Error('Cannot multiply array by a negative integer')
    const array = []
    for (let n = 0; n < value.__value; n++) array.push(...this.#value)
    return this.__new(array)
  }

  __new (value: TypedValue[]): XArray {
    return new XArray(value, this.#environment)
  }

  __toString (): string {
    return `[${this.#value.map(x => x.__toString()).join(' ')}]`
  }
}
