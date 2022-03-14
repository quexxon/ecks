import { Expression, Identifier, toString, TypedValue } from '../ast.ts'
import Interpreter from '../interpreter.ts'
import { State } from '../types.ts'
import XArray from './array.ts'
import XBoolean from './boolean.ts'

interface Lambda {
  params: Identifier[]
  body: Expression
}

export default class XLambda {
  kind = 'lambda'
  #value: Lambda
  #state: State

  constructor (value: Lambda, state: State) {
    this.#value = value
    this.#state = state
  }

  apply (args: XArray): TypedValue {
    return this.call(...args.__value)
  }

  call (...args: TypedValue[]): TypedValue {
    if (args.length !== this.#value.params.length) {
      throw new Error(`Expected ${this.#value.params.length} arguments`)
    }

    const state: State = {
      ...this.#state,
      environment: new Map(this.#state.environment)
    }
    for (let i = 0; i < args.length; i++) {
      const name = this.#value.params[i].name
      const value = args[i]
      state.environment.set(name, value)
    }

    const interpreter = new Interpreter(this.#value.body, state)
    return interpreter.render()
  }

  [Symbol.for('=')] (value: TypedValue): XBoolean {
    return new XBoolean(this.__eq(value), this.#state)
  }

  [Symbol.for('!=')] (value: TypedValue): XBoolean {
    return new XBoolean(!this.__eq(value), this.#state)
  }

  [Symbol.for('<')] (value: TypedValue): XBoolean {
    return new XBoolean(this.__lt(value), this.#state)
  }

  [Symbol.for('<=')] (value: TypedValue): XBoolean {
    return new XBoolean(this.__lt(value) || this.__eq(value), this.#state)
  }

  [Symbol.for('>')] (value: TypedValue): XBoolean {
    return new XBoolean(this.__gt(value), this.#state)
  }

  [Symbol.for('>=')] (value: TypedValue): XBoolean {
    return new XBoolean(this.__gt(value) || this.__eq(value), this.#state)
  }

  get __value (): Lambda { return this.#value }

  __eq (value: TypedValue): boolean {
    if (!(value instanceof XLambda)) throw new TypeError(`Expected ${this.kind}`)
    return this.__toString() === value.__toString()
  }

  __lt (value: TypedValue): boolean {
    if (!(value instanceof XLambda)) throw new TypeError(`Expected ${this.kind}`)
    return this.__toString() < value.__toString()
  }

  __gt (value: TypedValue): boolean {
    if (!(value instanceof XLambda)) throw new TypeError(`Expected ${this.kind}`)
    return this.__toString() > value.__toString()
  }

  __toString (): string {
    return `|${this.#value.params.map(x => x.name).join(' ')}| ${toString(this.#value.body)}`
  }
}
