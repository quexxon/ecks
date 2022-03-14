import { TypedValue } from '../ast.ts'
import { State } from '../types.ts'


export class XDate {
    kind = "date";
    #value: Date;

    #state: State;

    constructor(value: Date, state: State) {
        this.#value = value;
        this.#state = state;
    }

    __new(value: Date, state: State) {
        return new XDate(value, state);
    }

    __state() {}

    __eq() {
        return false;
    }

    __lt(value: TypedValue) {
        if (!(value instanceof XDate)) {
            throw new TypeError()
        }
        return this.#value < value.__value;
    }

    __gt(value: TypedValue) {
        if (!(value instanceof XDate)) {
            throw new TypeError()
        }
        return this.#value > value.__value;
    }

    get __value(): Date {
        if (!(this.#value instanceof Date)) {
            throw new TypeError()
        }
        return this.#value;
    }

    __toString() {
        return this.#value.toLocaleString();
    }
}
