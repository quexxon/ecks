import { TypedValue } from '../ast.ts'
import { State } from '../types.ts'
import XBoolean from './boolean.ts'
import XInteger from './integer.ts'
import XString from './string.ts'

function isNumber (value: unknown): value is XInteger | XFloat {
  return value instanceof XInteger || value instanceof XFloat
}

export default class XFloat {
  kind = 'float';
  #value: number;
  #state: State;

  constructor (value: number, state: State) {
    this.#value = value;
    this.#state = state;
  }

  abs(): XFloat {
    return this.__new(Math.abs(this.#value));
  }

  int (): XInteger {
    return new XInteger(this.#value, this.#state);
  }

  ceil (): XFloat {
    return this.__new(Math.ceil(this.#value));
  }

  floor (): XFloat {
    return this.__new(Math.floor(this.#value));
  }

  rnd (): XFloat {
    return this.__new(Math.round(this.#value));
  }

  ceili (): XInteger {
    return new XInteger(Math.ceil(this.#value), this.#state)
  }

  floori (): XInteger {
    return new XInteger(Math.floor(this.#value), this.#state)
  }

  rndi (): XInteger {
    return new XInteger(Math.round(this.#value), this.#state)
  }

  sqrt (): XFloat {
    return this.__new(Math.sqrt(this.#value))
  }

  clamp (x: XInteger | XFloat, y: XInteger | XFloat): XFloat {
    if (this.#value < x.__value) return this.__new(x.__value)
    if (this.#value > y.__value) return this.__new(y.__value)
    return this
  }

  str (): XString {
    return new XString(this.__toString(), this.#state)
  }

  [Symbol.for('neg')] (): XFloat {
    return this.__new(-this.#value)
  }

  [Symbol.for('+')] (value: TypedValue): XFloat {
    if (!isNumber(value)) throw new TypeError()
    return this.__new(this.#value + value.__value)
  }

  [Symbol.for('-')] (value: TypedValue): XFloat {
    if (!isNumber(value)) throw new TypeError()
    return this.__new(this.#value - value.__value)
  }

  [Symbol.for('*')] (value: TypedValue): XFloat {
    if (!isNumber(value)) throw new TypeError()
    return this.__new(this.#value * value.__value)
  }

  [Symbol.for('/')] (value: TypedValue): XFloat {
    if (!isNumber(value)) throw new TypeError()
    return this.__new(this.#value / value.__value)
  }

  [Symbol.for('%')] (value: TypedValue): XFloat {
    if (!isNumber(value)) throw new TypeError()
    return this.__new(this.#value % value.__value)
  }

  [Symbol.for('^')] (value: TypedValue): XFloat {
    if (!isNumber(value)) throw new TypeError()
    return this.__new(this.#value ** value.__value)
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

  get __value (): number { return this.#value }

  __new (value: number): XFloat {
    return new XFloat(value, this.#state)
  }

  __eq (value: TypedValue): boolean {
    if (!isNumber(value)) throw new TypeError('Expected a number')
    return this.#value === value.__value
  }

  __lt (value: TypedValue): boolean {
    if (!isNumber(value)) throw new TypeError('Expected a number')
    return this.#value < value.__value
  }

  __gt (value: TypedValue): boolean {
    if (!isNumber(value)) throw new TypeError('Expected a number')
    return this.#value > value.__value
  }

  __toString (): string {
    if (Math.trunc(this.#value) === this.#value) {
      return this.__value.toString() + '.0'
    }

    return this.#value.toString()
  }
}
