import { Expression, Identifier, toString, TypedValue } from '../ast'
import Interpreter from '../interpreter'
import { State } from '../types'
import XArray from './array'

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
    return interpreter.eval()
  }

  get __value (): Lambda { return this.#value }

  __toString (): string {
    return `|${this.#value.params.map(x => x.name).join(' ')}| ${toString(this.#value.body)}`
  }
}
