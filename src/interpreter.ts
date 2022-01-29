import {
  ArrayGroup,
  Binary,
  Case,
  Cond,
  Expression,
  Grouping,
  Identifier,
  Index,
  Lambda,
  Let,
  MapGroup,
  MethodCall,
  Optional,
  Primitive,
  RecordGroup,
  SetGroup,
  Ternary,
  TupleGroup,
  TypedValue,
  Unary,
  UnaryOperator
} from './ast'
import XArray from './std/array'
import XBoolean from './std/boolean'
import XLambda from './std/lambda'
import XMap from './std/map'
import XOptional from './std/optional'
import XSet from './std/set'
import XString from './std/string'
import XTemplateString from './std/templateString'
import XTuple from './std/tuple'
import { State } from './types'

export default class Interpreter {
  #expression: Expression
  #state: State

  constructor (expression: Expression, state: State) {
    this.#expression = expression
    this.#state = state
  }

  eval (): TypedValue {
    return this.#evaluate(this.#expression)
  }

  #evaluate (expression: Expression): TypedValue {
    switch (expression.kind) {
      case 'primitive': return this.#primitive(expression)
      case 'grouping': return this.#grouping(expression)
      case 'unary': return this.#unary(expression)
      case 'binary': return this.#binary(expression)
      case 'ternary': return this.#ternary(expression)
      case 'cond': return this.#cond(expression)
      case 'case': return this.#case(expression)
      case 'let': return this.#let(expression)
      case 'array': return this.#array(expression)
      case 'set': return this.#set(expression)
      case 'tuple': return this.#tuple(expression)
      case 'map': return this.#map(expression)
      case 'record': return this.#record(expression)
      case 'method-call': return this.#methodCall(expression)
      case 'index': return this.#index(expression)
      case 'lambda': return this.#lambda(expression)
      case 'optional': return this.#optional(expression)
      case 'identifier': return this.#identifier(expression)
    }
  }

  #primitive (primitive: Primitive): TypedValue {
    return (
      primitive.value instanceof XTemplateString
        ? primitive.value.evaluate(this.#state)
        : primitive.value
    )
  }

  #grouping (grouping: Grouping): TypedValue {
    return this.#evaluate(grouping.expression)
  }

  #unary (unary: Unary): TypedValue {
    const operand = this.#evaluate(unary.operand)

    // TypeScript bug: Symbols cannot be used to index class
    // Ref: https://github.com/microsoft/TypeScript/issues/38009
    interface UnaryOperand { [key: symbol]: () => TypedValue }

    if (unary.operator === UnaryOperator.Negation) {
      if (Symbol.for('neg') in operand) {
        return ((operand as object) as UnaryOperand)[Symbol.for('neg')]()
      }
    }

    if (Symbol.for(unary.operator) in operand) {
      return ((operand as object) as UnaryOperand)[Symbol.for(unary.operator)]()
    }

    throw new TypeError()
  }

  #binary (binary: Binary): TypedValue {
    const l = this.#evaluate(binary.left)
    const r = this.#evaluate(binary.right)

    // TypeScript bug: Symbols cannot be used to index class
    // Ref: https://github.com/microsoft/TypeScript/issues/38009
    interface BinaryOperand { [key: symbol]: (r: any) => TypedValue }

    if (Symbol.for(binary.operator) in l) {
      return ((l as object) as BinaryOperand)[Symbol.for(binary.operator)](r)
    }

    throw new TypeError()
  }

  #ternary (ternary: Ternary): TypedValue {
    const condition = this.#evaluate(ternary.antecedent)

    if (!(condition instanceof XBoolean)) {
      throw new TypeError()
    }

    if (condition.__value) {
      return this.#evaluate(ternary.consequent)
    } else {
      return this.#evaluate(ternary.alternative)
    }
  }

  #cond (cond: Cond): TypedValue {
    let result: TypedValue | undefined
    for (const [antecedent, consequent] of cond.branches) {
      const condition = this.#evaluate(antecedent)
      if (!(condition instanceof XBoolean)) {
        throw new TypeError()
      }

      if (condition.__value) {
        result = this.#evaluate(consequent)
        break
      }
    }

    if (cond.else === undefined) {
      return new XOptional(this.#state, result)
    }

    if (result === undefined) {
      result = this.#evaluate(cond.else)
    }

    return result
  }

  #case (case_: Case): TypedValue {
    const target = this.#evaluate(case_.target)
    if (target instanceof XLambda || target instanceof XOptional) {
      throw new TypeError()
    }

    let result: TypedValue | undefined
    for (const [caseValue, expression] of case_.branches) {
      const case_ = this.#evaluate(caseValue)

      if (case_ instanceof XLambda || case_ instanceof XOptional) {
        throw new TypeError()
      }

      if (case_.kind !== target.kind) {
        throw new TypeError()
      }

      if (case_.__value === target.__value) {
        result = this.#evaluate(expression)
      }
    }

    if (case_.else === undefined) {
      return new XOptional(this.#state, result)
    }

    if (result === undefined) {
      result = this.#evaluate(case_.else)
    }

    return result
  }

  #let (let_: Let): TypedValue {
    const state: State = {
      environment: new Map(this.#state.environment),
      records: new Map(this.#state.records)
    }
    for (const [name, expression] of let_.bindings) {
      const interpreter = new Interpreter(expression, state)
      const value = interpreter.eval()
      state.environment.set(name.name, value)
    }
    const interpreter = new Interpreter(let_.body, state)
    return interpreter.eval()
  }

  #array (array: ArrayGroup): TypedValue {
    return new XArray(array.elements.map(e => this.#evaluate(e)), this.#state)
  }

  #set (set: SetGroup): TypedValue {
    return new XSet(set.elements.map(e => this.#evaluate(e)), this.#state)
  }

  #tuple (tuple: TupleGroup): TypedValue {
    return new XTuple(tuple.elements.map(e => this.#evaluate(e)), this.#state)
  }

  #map (map: MapGroup): TypedValue {
    return new XMap(
      map.elements.map(([k, v]) => [this.#evaluate(k), this.#evaluate(v)]),
      this.#state
    )
  }

  #record (record: RecordGroup): TypedValue {
    const RecordType = this.#state.records.get(record.name)

    if (RecordType === undefined) {
      throw new TypeError(`No registered record named '${record.name}'`)
    }

    return new RecordType(
      record.members.reduce<Map<string, TypedValue>>((members, [id, expr]) => {
        members.set(id.name, this.#evaluate(expr))
        return members
      }, new Map()),
      this.#state
    )
  }

  #methodCall (methodCall: MethodCall): TypedValue {
    const receiver = this.#evaluate(methodCall.receiver)
    const identifier = methodCall.identifier.name.toLowerCase()

    interface XObject { [key: string]: (...args: any) => TypedValue }

    if (identifier in receiver) {
      const method = ((receiver as object) as XObject)[identifier]
      return method.apply(receiver, methodCall.arguments.map(exp => this.#evaluate(exp)))
    }

    throw new TypeError(`No method "${identifier}" for ${receiver.kind}`)
  }

  #index (index: Index): TypedValue {
    const receiver = this.#evaluate(index.receiver)

    if (receiver instanceof XArray) {
      return receiver.at(this.#evaluate(index.index))
    }

    if (receiver instanceof XString) {
      return receiver.at(this.#evaluate(index.index))
    }

    if (receiver instanceof XMap) {
      return receiver.get(this.#evaluate(index.index))
    }

    if (receiver instanceof XTuple) {
      return receiver.at(this.#evaluate(index.index))
    }

    throw new TypeError(`Index expressions are not supported for ${receiver.kind}`)
  }

  #lambda (lambda: Lambda): TypedValue {
    return new XLambda({
      params: lambda.parameters,
      body: lambda.body
    }, this.#state)
  }

  #optional (optional: Optional): XOptional {
    const value = optional.value === undefined ? undefined : this.#evaluate(optional.value)
    return new XOptional(this.#state, value)
  }

  #identifier (identifier: Identifier): TypedValue {
    const value = this.#state.environment.get(identifier.name.toLowerCase())

    if (value === undefined) {
      throw new TypeError(`Unrecognized identifier: ${identifier.name}`)
    }

    return value
  }
}
