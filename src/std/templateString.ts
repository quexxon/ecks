export default class XTemplateString {
  kind = 'template_string'
  #value: string

  constructor (value: string) {
    this.#value = value
  }

  get value (): string { return this.#value }

  __toString (): string {
    return this.#value.toString()
  }
}
