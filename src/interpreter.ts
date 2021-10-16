import {
  ArrayGroup,
  Binary,
  BinaryOperator,
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
  SetGroup,
  Ternary,
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
import XTemplateString from './std/templateString'
import { Environment } from './types'

export default class Interpreter {
  #expression: Expression
  #environment: Environment

  constructor (expression: Expression, environment: Environment = new Map()) {
    this.#expression = expression
    this.#environment = environment
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
      case 'map': return this.#map(expression)
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
        ? primitive.value.evaluate(this.#environment)
        : primitive.value
    )
  }

  #grouping (grouping: Grouping): TypedValue {
    return this.#evaluate(grouping.expression)
  }

  #unary (unary: Unary): TypedValue {
    const operand = this.#evaluate(unary.operand)

    switch (unary.operator) {
      case UnaryOperator.Negation:
        if ('neg' in operand) return operand.neg()
        break
      case UnaryOperator.Not:
        if ('not' in operand) return operand.not()
        break
    }

    throw new TypeError()
  }

  #binary (binary: Binary): TypedValue {
    const l = this.#evaluate(binary.left)
    const r = this.#evaluate(binary.right)

    switch (binary.operator) {
      case BinaryOperator.Addition:
        if ('add' in l) return l.add(r)
        break
      case BinaryOperator.Subtraction:
        if ('sub' in l) return l.sub(r)
        break
      case BinaryOperator.Multiplication:
        if ('mult' in l) return l.mult(r)
        break
      case BinaryOperator.Division:
        if ('div' in l) return l.div(r)
        break
      case BinaryOperator.Equal:
        if ('eq' in l) return l.eq(r)
        break
      case BinaryOperator.NotEqual:
        if ('neq' in l) return l.neq(r)
        break
      case BinaryOperator.LessThan:
        if ('lt' in l) return l.lt(r)
        break
      case BinaryOperator.LessThanOrEqual:
        if ('lte' in l) return l.lte(r)
        break
      case BinaryOperator.GreaterThan:
        if ('gt' in l) return l.gt(r)
        break
      case BinaryOperator.GreaterThanOrEqual:
        if ('gte' in l) return l.gte(r)
        break
      case BinaryOperator.Or:
        if ('or' in l) return l.or(r)
        break
      case BinaryOperator.And:
        if ('and' in l) return l.and(r)
        break
      case BinaryOperator.Optional:
        if ('opt' in l) return l.opt(r)
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
      return new XOptional(this.#environment, result)
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
      return new XOptional(this.#environment, result)
    }

    if (result === undefined) {
      result = this.#evaluate(case_.else)
    }

    return result
  }

  #let (let_: Let): TypedValue {
    const environment = new Map(this.#environment)
    for (const [name, expression] of let_.bindings) {
      const interpreter = new Interpreter(expression, environment)
      const value = interpreter.eval()
      environment.set(name.name, value)
    }
    const interpreter = new Interpreter(let_.body, environment)
    return interpreter.eval()
  }

  #array (array: ArrayGroup): TypedValue {
    return new XArray(array.elements.map(e => this.#evaluate(e)), this.#environment)
  }

  #set (set: SetGroup): TypedValue {
    return new XSet(set.elements.map(e => this.#evaluate(e)), this.#environment)
  }

  #map (map: MapGroup): TypedValue {
    return new XMap(
      map.elements.map(([k, v]) => [this.#evaluate(k), this.#evaluate(v)]),
      this.#environment
    )
  }

  #methodCall (methodCall: MethodCall): TypedValue {
    const receiver = this.#evaluate(methodCall.receiver)

    if (methodCall.identifier.name in receiver.methods) {
      const method = receiver.methods[methodCall.identifier.name]
      return method.call.apply(null, methodCall.arguments.map(exp => this.#evaluate(exp)))
    }

    throw new TypeError(`No method "${methodCall.identifier.name}" for ${receiver.kind}`)
  }

  #index (index: Index): TypedValue {
    const receiver = this.#evaluate(index.receiver)

    if (receiver instanceof XArray) {
      return receiver.methods.at.call(this.#evaluate(index.index))
    }

    if (receiver instanceof XMap) {
      return receiver.methods.get.call(this.#evaluate(index.index))
    }

    throw new TypeError(`Index expressions are not supported for ${receiver.kind}`)
  }

  #lambda (lambda: Lambda): TypedValue {
    return new XLambda({
      params: lambda.parameters,
      body: lambda.body
    }, this.#environment)
  }

  #optional (optional: Optional): XOptional {
    const value = optional.value === undefined ? undefined : this.#evaluate(optional.value)
    return new XOptional(this.#environment, value)
  }

  #identifier (identifier: Identifier): TypedValue {
    const value = this.#environment.get(identifier.name)

    if (value === undefined) {
      throw new TypeError(`Unrecognized identifier: ${identifier.name}`)
    }

    return value
  }
}
