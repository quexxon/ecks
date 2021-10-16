import { TypedValue } from '../ast'
import { Environment, MethodType } from '../types'

export default class XOptional {
  kind = 'optional'
  #value?: TypedValue
  #environment: Environment
  methods: Record<string, MethodType> = {}

  constructor (environment: Environment, value?: TypedValue) {
    this.#environment = environment
    this.#value = value
  }

  opt (value: TypedValue): TypedValue {
    return this.#value === undefined ? value : this.#value
  }

  get __value (): TypedValue | undefined { return this.#value }

  __toString (): string {
    if (this.#value === undefined) return 'none'
    return `some(${this.#value.__toString()})`
  }
}
