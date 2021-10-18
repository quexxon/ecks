import { TypedValue } from '../ast'
import { Environment } from '../types'

export default abstract class XRecord {
  kind = 'record'
  protected readonly value: Map<string, TypedValue>
  protected readonly environment: Environment

  constructor (value: Map<string, TypedValue>, environment: Environment) {
    this.value = value
    this.environment = environment
  }

  get __value (): Map<string, TypedValue> { return this.value }

  abstract __new (value: Map<string, TypedValue>): XRecord

  __toString (): string {
    const members = Array.from(this.__value.entries()).map(([name, value]) => {
      return `${name}: ${value.__toString()}`
    }).join(', ')

    return `point {${members}}`
  }
}
