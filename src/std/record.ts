import { TypedValue } from '../ast'
import { State } from '../types'

export default abstract class XRecord {
  kind = 'record'
  readonly __value: Map<string, TypedValue>
  protected readonly __state: State

  constructor (value: Map<string, TypedValue>, state: State) {
    this.__value = value
    this.__state = state
  }

  abstract __new (value: Map<string, TypedValue>): XRecord

  __toString (): string {
    const members = Array.from(this.__value.entries()).map(([name, value]) => {
      return `${name}: ${value.__toString()}`
    }).join(', ')

    return `${(this as object).constructor.name.toLowerCase()} {${members}}`
  }
}
