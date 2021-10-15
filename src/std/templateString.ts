import { Environment, MethodType } from '../types'

export default class XTemplateString {
  kind = 'template_string'
  #value: string
  #environment: Environment
  methods: Record<string, MethodType> = {}

  constructor (value: string, environment: Environment) {
    this.#value = value
    this.#environment = environment
  }

  get __value (): string { return this.#value }

  __toString (): string {
    return this.#value.toString()
  }
}
