import {
  Binary,
  BinaryOperator,
  Expression,
  Grouping,
  Primitive,
  TypedValue,
  Unary,
  UnaryOperator
} from './ast'

export default class Interpreter {
  #expression: Expression
  constructor (expression: Expression) {
    this.#expression = expression
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
    }
  }

  #primitive (primitive: Primitive): TypedValue {
    return primitive.value
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
    }

    throw new TypeError()
  }
}
