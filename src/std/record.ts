import { TypedValue } from '../ast'
import { State } from '../types'
import XBoolean from './boolean'

export default abstract class XRecord {
  kind = 'record'
  readonly __value: Map<string, TypedValue>
  protected readonly __state: State

  constructor (value: Map<string, TypedValue>, state: State) {
    this.__value = value
    this.__state = state
  }

  [Symbol.for('=')] (value: TypedValue): XBoolean {
    if (!(value instanceof (this as object).constructor)) {
      throw new TypeError(`Expected ${this.__name}`)
    }
    return new XBoolean(this.__toString() === value.__toString(), this.__state)
  }

  abstract __new (value: Map<string, TypedValue>): XRecord

  get __name (): string {
    return (this as object).constructor.name.toLocaleLowerCase()
  }

  __toString (): string {
    const members = Array.from(this.__value.entries()).map(([name, value]) => {
      return `${name}: ${value.__toString()}`
    }).join(', ')

    return `${this.__name} {${members}}`
  }
}
