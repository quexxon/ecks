import { Expression, Identifier, TypedValue } from '../ast'
import Interpreter from '../interpreter'
import { Environment, MethodType } from '../types'

interface Lambda {
  params: Identifier[]
  body: Expression
}

export default class XLambda {
  kind = 'lambda'
  #value: Lambda
  #environment: Environment
  methods: Record<string, MethodType> = {
    call: {
      arguments: [],
      call: (...args: TypedValue[]) => this.call(...args)
    }
  }

  constructor (value: Lambda, environment: Environment) {
    this.#value = value
    this.#environment = environment
  }

  call (...args: TypedValue[]): TypedValue {
    if (args.length !== this.#value.params.length) {
      throw new Error(`Expected ${this.#value.params.length} arguments`)
    }

    const newEnvironment: Environment = new Map(this.#environment)
    for (let i = 0; i < args.length; i++) {
      const name = this.#value.params[i].name
      const value = args[i]
      newEnvironment.set(name, value)
    }

    const interpreter = new Interpreter(this.#value.body, newEnvironment)
    return interpreter.eval()
  }

  __toString (): string {
    return `|${this.#value.params.map(x => x.name).join(', ')}|`
  }
}
