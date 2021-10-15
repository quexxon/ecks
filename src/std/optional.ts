import { Environment, MethodType } from '../types'

export default class XOptional {
  kind = 'optional'
  #value = undefined
  #environment: Environment
  methods: Record<string, MethodType> = {}

  get value (): undefined { return this.#value }

  constructor (environment: Environment) {
    this.#environment = environment
  }

  __toString (): string {
    return 'optional'
  }
}
