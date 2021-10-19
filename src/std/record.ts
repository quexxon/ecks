import { TypedValue } from '../ast'
import { Environment } from '../types'

export default abstract class XRecord {
  kind = 'record'
  readonly __value: Map<string, TypedValue>
  protected readonly __environment: Environment

  constructor (value: Map<string, TypedValue>, environment: Environment) {
    this.__value = value
    this.__environment = environment
  }

  abstract __new (value: Map<string, TypedValue>): XRecord

  __toString (): string {
    const members = Array.from(this.__value.entries()).map(([name, value]) => {
      return `${name}: ${value.__toString()}`
    }).join(', ')

    return `${(this as object).constructor.name.toLowerCase()} {${members}}`
  }
}
