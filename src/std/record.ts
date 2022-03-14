import { TypedValue } from '../ast.ts'
import { State } from '../types.ts'
import XBoolean from './boolean.ts'
import XOptional from './optional.ts'

export default abstract class XRecord {
  kind = 'record'
  readonly __value: Map<string, TypedValue>
  protected readonly __state: State

  constructor (value: Map<string, TypedValue>, state: State) {
    this.__value = value
    this.__state = state
  }

  get (key: TypedValue): XOptional {
    return new XOptional(this.__state, this.__value.get(key.__value as any))
  }
  //get(prop: string): TypedValue {
  //  if (this.__value.has(prop)) {
  //      return this.__value.get(prop) as TypedValue;
  //  }
  //  throw new TypeError("Tried to access value at non-existent index")
  //}

  [Symbol.for('=')] (value: TypedValue): XBoolean {
    return new XBoolean(this.__eq(value), this.__state)
  }

  [Symbol.for('!=')] (value: TypedValue): XBoolean {
    return new XBoolean(!this.__eq(value), this.__state)
  }

  [Symbol.for('<')] (value: TypedValue): XBoolean {
    return new XBoolean(this.__lt(value), this.__state)
  }

  [Symbol.for('<=')] (value: TypedValue): XBoolean {
    return new XBoolean(this.__lt(value) || this.__eq(value), this.__state)
  }

  [Symbol.for('>')] (value: TypedValue): XBoolean {
    return new XBoolean(this.__gt(value), this.__state)
  }

  [Symbol.for('>=')] (value: TypedValue): XBoolean {
    return new XBoolean(this.__gt(value) || this.__eq(value), this.__state)
  }

  get __name (): string {
    return (this as object).constructor.name.toLocaleLowerCase()
  }

  abstract __new (value: Map<string, TypedValue>): XRecord

  __eq (value: TypedValue): boolean {
    if (!(value instanceof (this as object).constructor)) {
      throw new TypeError(`Expected ${this.__name}`)
    }
    return this.__toString() === value.__toString()
  }

  __lt (value: TypedValue): boolean {
    if (!(value instanceof XRecord && value instanceof (this as object).constructor)) {
      throw new TypeError(`Expected ${this.__name}`)
    }

    const sortedValue = Array.from(this.__value)
      .sort(([x], [y]) => {
        if (x < y) return -1
        if (x > y) return 1
        return 0
      })

    for (const [k, v1] of sortedValue) {
      const v2 = value.__value.get(k)
      if (v2 === undefined) throw new TypeError()
      if (v1.__lt(v2)) return true
      if (v1.__gt(v2)) return false
    }

    return false
  }

  __gt (value: TypedValue): boolean {
    if (!(value instanceof XRecord && value instanceof (this as object).constructor)) {
      throw new TypeError(`Expected ${this.__name}`)
    }

    const sortedValue = Array.from(this.__value)
      .sort(([x], [y]) => {
        if (x < y) return -1
        if (x > y) return 1
        return 0
      })

    for (const [k, v1] of sortedValue) {
      const v2 = value.__value.get(k)
      if (v2 === undefined) throw new TypeError()
      if (v1.__gt(v2)) return true
      if (v1.__lt(v2)) return false
    }

    return false
  }

  __toString (): string {
    const members = Array.from(this.__value.entries())
      .sort(([x], [y]) => {
        if (x < y) return -1
        if (x > y) return 1
        return 0
      })
      .map(([name, value]) => `${name}: ${value.__toString()}`)
      .join(', ')

    return `${this.__name} {${members}}`
  }
}
