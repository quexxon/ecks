import { TypedValue } from "../ast.js";
import { State } from "../types.js";

export class XDate {
    kind = "date";
    #value: Date;

    #state: State;

    constructor(value: Date, state: State) {
        this.#value = value;
        this.#state = state;
    }

    __new(value: Date, state: State): XDate {
        return new XDate(value, state);
    }

    __state(): State {
        return this.#state;
    }

    __eq(): boolean {
        return false;
    }

    __lt(value: TypedValue): boolean {
        if (!(value instanceof XDate)) {
            throw new TypeError();
        }
        return this.#value < value.__value;
    }

    __gt(value: TypedValue): boolean {
        if (!(value instanceof XDate)) {
            throw new TypeError();
        }
        return this.#value > value.__value;
    }

    get __value(): Date {
        if (!(this.#value instanceof Date)) {
            throw new TypeError();
        }
        return this.#value;
    }

    __toString(): string {
        return this.#value.toLocaleString();
    }
}
