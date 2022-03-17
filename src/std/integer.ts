import { TypedValue } from "../ast.js";
import { State } from "../types.js";
import XBoolean from "./boolean.js";
import XFloat from "./float.js";
import XString from "./string.js";

function isNumber(value: unknown): value is XInteger | XFloat {
    return value instanceof XInteger || value instanceof XFloat;
}

export default class XInteger {
    kind = "integer";
    #value: number;
    #state: State;

    constructor(value: number, state: State) {
        this.#value = Math.trunc(value);
        this.#state = state;
    }

    float(): XFloat {
        return new XFloat(this.#value, this.#state);
    }

    str(): XString {
        return new XString(this.__toString(), this.#state);
    }

    abs(): XInteger {
        return this.__new(Math.abs(this.#value));
    }

    clamp(x: XInteger | XFloat, y: XInteger | XFloat): XInteger {
        if (this.#value < x.__value) return this.__new(x.__value);
        if (this.#value > y.__value) return this.__new(y.__value);
        return this;
    }

    sqrt(): XFloat {
        return new XFloat(Math.sqrt(this.#value), this.#state);
    }

    pow(exp: XInteger | XFloat): XFloat {
        return new XFloat(Math.pow(this.#value, exp.__value), this.#state); // Raising to a non-integer power produces a float
    }

    [Symbol.for("neg")](): XInteger {
        return this.__new(-this.#value);
    }

    [Symbol.for("+")](value: TypedValue): XInteger | XFloat {
        if (!isNumber(value)) throw new TypeError();
        const n = this.#value + value.__value;
        return value instanceof XFloat
            ? new XFloat(n, this.#state)
            : this.__new(n);
    }

    [Symbol.for("-")](value: TypedValue): XInteger | XFloat {
        if (!isNumber(value)) throw new TypeError();
        const n = this.#value - value.__value;
        return value instanceof XFloat
            ? new XFloat(n, this.#state)
            : this.__new(n);
    }

    [Symbol.for("*")](value: TypedValue): XInteger | XFloat {
        if (!isNumber(value)) throw new TypeError();
        const n = this.#value * value.__value;
        return value instanceof XFloat
            ? new XFloat(n, this.#state)
            : this.__new(n);
    }

    [Symbol.for("/")](value: TypedValue): XInteger | XFloat {
        if (!isNumber(value)) throw new TypeError();
        if (value instanceof XFloat) {
            return new XFloat(this.#value / value.__value, this.#state);
        }
        return this.__new(Math.trunc(this.#value / value.__value));
    }

    [Symbol.for("%")](value: TypedValue): XInteger | XFloat {
        if (!isNumber(value)) throw new TypeError();
        const n = this.#value % value.__value;
        return value instanceof XFloat
            ? new XFloat(n, this.#state)
            : this.__new(n);
    }

    [Symbol.for("^")](value: TypedValue): XInteger | XFloat {
        if (!isNumber(value)) throw new TypeError();
        const n = this.#value ** value.__value;
        return value instanceof XFloat
            ? new XFloat(n, this.#state)
            : this.__new(n);
    }

    [Symbol.for("=")](value: TypedValue): XBoolean {
        return new XBoolean(this.__eq(value), this.#state);
    }

    [Symbol.for("!=")](value: TypedValue): XBoolean {
        return new XBoolean(!this.__eq(value), this.#state);
    }

    [Symbol.for("<")](value: TypedValue): XBoolean {
        return new XBoolean(this.__lt(value), this.#state);
    }

    [Symbol.for("<=")](value: TypedValue): XBoolean {
        return new XBoolean(this.__lt(value) || this.__eq(value), this.#state);
    }

    [Symbol.for(">")](value: TypedValue): XBoolean {
        return new XBoolean(this.__gt(value), this.#state);
    }

    [Symbol.for(">=")](value: TypedValue): XBoolean {
        return new XBoolean(this.__gt(value) || this.__eq(value), this.#state);
    }

    get __value(): number {
        return this.#value;
    }

    __new(value: number): XInteger {
        return new XInteger(value, this.#state);
    }

    __eq(value: TypedValue): boolean {
        if (!isNumber(value)) throw new TypeError("Expected a number");
        return this.#value === value.__value;
    }

    __lt(value: TypedValue): boolean {
        if (!isNumber(value)) throw new TypeError("Expected a number");
        return this.#value < value.__value;
    }

    __gt(value: TypedValue): boolean {
        if (!isNumber(value)) throw new TypeError("Expected a number");
        return this.#value > value.__value;
    }

    __toString(): string {
        return this.#value.toString();
    }
}
