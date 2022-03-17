import { TypedValue } from "../ast.js";
import { State } from "../types.js";
import XString from "./string.js";

export default class XBoolean {
    kind = "boolean";
    #value: boolean;
    #state: State;

    constructor(value: boolean, state: State) {
        this.#value = value;
        this.#state = state;
    }

    str(): XString {
        return new XString(this.__toString(), this.#state);
    }

    [Symbol.for("!")](): XBoolean {
        return this.__new(!this.#value);
    }

    [Symbol.for("=")](value: TypedValue): XBoolean {
        return this.__new(this.__eq(value));
    }

    [Symbol.for("!=")](value: TypedValue): XBoolean {
        return this.__new(!this.__eq(value));
    }

    [Symbol.for("or")](value: TypedValue): XBoolean {
        if (!(value instanceof XBoolean))
            throw new TypeError(`Expected ${this.kind}`);
        return this.__new(this.#value || value.__value);
    }

    [Symbol.for("and")](value: TypedValue): XBoolean {
        if (!(value instanceof XBoolean))
            throw new TypeError(`Expected ${this.kind}`);
        return this.__new(this.#value && value.__value);
    }

    [Symbol.for("<")](value: TypedValue): XBoolean {
        return this.__new(this.__lt(value));
    }

    [Symbol.for("<=")](value: TypedValue): XBoolean {
        return this.__new(this.__lt(value) || this.__eq(value));
    }

    [Symbol.for(">")](value: TypedValue): XBoolean {
        return this.__new(this.__gt(value));
    }

    [Symbol.for(">=")](value: TypedValue): XBoolean {
        return this.__new(this.__gt(value) || this.__eq(value));
    }

    get __value(): boolean {
        return this.#value;
    }

    __new(value: boolean): XBoolean {
        return new XBoolean(value, this.#state);
    }

    __eq(value: TypedValue): boolean {
        if (!(value instanceof XBoolean))
            throw new TypeError(`Expected ${this.kind}`);

        return this.#value === value.__value;
    }

    __lt(value: TypedValue): boolean {
        if (!(value instanceof XBoolean))
            throw new TypeError(`Expected ${this.kind}`);

        return !this.#value && value.__value;
    }

    __gt(value: TypedValue): boolean {
        if (!(value instanceof XBoolean))
            throw new TypeError(`Expected ${this.kind}`);

        return this.#value && !value.__value;
    }

    __toString(): string {
        return this.#value.toString();
    }
}
