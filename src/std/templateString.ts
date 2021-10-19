import { State } from '../types'
import XString from './string'
import Ecks from '..'

export default class XTemplateString {
  kind = 'template_string'
  #value: string
  #state: State

  constructor (value: string, state: State) {
    this.#value = value
    this.#state = state
  }

  evaluate (state: State): XString {
    const segments: string[] = []

    let depth = 0
    let start = 0
    let end = 0
    let isEscape = false
    for (let i = 0; i < this.#value.length; i++) {
      if (isEscape) {
        isEscape = false
        continue
      }

      const char = this.#value[i]

      if (char === '\\') {
        isEscape = true
        continue
      }

      if (char === '{') {
        if (depth === 0) start = i
        depth++
      }

      if (char === '}') {
        depth--
        if (depth < 0) throw new SyntaxError('Unmatched `}` in template string')
        if (depth > 1) continue
        if (depth === 0) {
          segments.push(this.#value.slice(end, start))
          end = i + 1
          const expression = this.#value.slice(start + 1, i)
          const value = Ecks.eval(expression, state)
          segments.push(value instanceof XString ? value.__value : value.__toString())
        }
      }
    }

    segments.push(this.#value.slice(end))

    return new XString(segments.join(''), this.#state)
  }

  get __value (): string { return this.#value }

  __toString (): string {
    return this.#value.toString()
  }
}
