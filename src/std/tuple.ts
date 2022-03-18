import { TypedValue } from "../ast.js";
import { State } from "../types.js";
import XBoolean from "./boolean.js";
import XInteger from "./integer.js";

export default class XTuple {
    kind = "tuple";
    #value: TypedValue[];
    #state: State;

    constructor(value: TypedValue[], state: State) {
        this.#value = value;
        this.#state = state;
    }

    at(index: TypedValue): TypedValue {
        if (!(index instanceof XInteger)) throw new TypeError();
        if (index.__value < 0 || index.__value >= this.#value.length) {
            throw new TypeError("Invalid index");
        }
        return this.#value[index.__value];
    }

    len(): XInteger {
        return new XInteger(this.__length, this.#state);
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

    get __value(): TypedValue[] {
        return this.#value;
    }
    get __length(): number {
        return this.#value.length;
    }

    __new(value: TypedValue[]): XTuple {
        return new XTuple(value, this.#state);
    }

    __eq(value: TypedValue): boolean {
        if (!(value instanceof XTuple))
            throw new TypeError(`Expected ${this.kind}`);
        if (this.__length !== value.__length) return false;
        for (let i = 0; i < this.__length; i++) {
            if (!this.#value[i].__eq(value.__value[i])) return false;
        }
        return true;
    }

    __lt(value: TypedValue): boolean {
        if (!(value instanceof XTuple))
            throw new TypeError(`Expected ${this.kind}`);

        const limit = Math.min(this.__length, value.__length);
        for (let i = 0; i < limit; i++) {
            if (this.#value[i].__lt(value.__value[i])) return true;
        }

        return false;
    }

    __gt(value: TypedValue): boolean {
        if (!(value instanceof XTuple))
            throw new TypeError(`Expected ${this.kind}`);

        const limit = Math.min(this.__length, value.__length);
        for (let i = 0; i < limit; i++) {
            if (this.#value[i].__gt(value.__value[i])) return true;
        }

        return false;
    }

    __toString(): string {
        return `@[${this.#value.map((x) => x.__toString()).join(" ")}]`;
    }
}
