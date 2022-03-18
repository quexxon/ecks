import XBoolean from "./boolean.js";
import XOptional from "./optional.js";
export default class XRecord {
    constructor(value, state) {
        this.kind = "record";
        this.__value = value;
        this.__state = state;
    }
    get(key) {
        return new XOptional(this.__state, this.__value.get(key.__value));
    }
    //get(prop: string): TypedValue {
    //  if (this.__value.has(prop)) {
    //      return this.__value.get(prop) as TypedValue;
    //  }
    //  throw new TypeError("Tried to access value at non-existent index")
    //}
    [Symbol.for("=")](value) {
        return new XBoolean(this.__eq(value), this.__state);
    }
    [Symbol.for("!=")](value) {
        return new XBoolean(!this.__eq(value), this.__state);
    }
    [Symbol.for("<")](value) {
        return new XBoolean(this.__lt(value), this.__state);
    }
    [Symbol.for("<=")](value) {
        return new XBoolean(this.__lt(value) || this.__eq(value), this.__state);
    }
    [Symbol.for(">")](value) {
        return new XBoolean(this.__gt(value), this.__state);
    }
    [Symbol.for(">=")](value) {
        return new XBoolean(this.__gt(value) || this.__eq(value), this.__state);
    }
    get __name() {
        return this.constructor.name.toLocaleLowerCase();
    }
    __eq(value) {
        if (!(value instanceof this.constructor)) {
            throw new TypeError(`Expected ${this.__name}`);
        }
        return this.__toString() === value.__toString();
    }
    __lt(value) {
        if (!(value instanceof XRecord && value instanceof this.constructor)) {
            throw new TypeError(`Expected ${this.__name}`);
        }
        const sortedValue = Array.from(this.__value).sort(([x], [y]) => {
            if (x < y)
                return -1;
            if (x > y)
                return 1;
            return 0;
        });
        for (const [k, v1] of sortedValue) {
            const v2 = value.__value.get(k);
            if (v2 === undefined)
                throw new TypeError();
            if (v1.__lt(v2))
                return true;
            if (v1.__gt(v2))
                return false;
        }
        return false;
    }
    __gt(value) {
        if (!(value instanceof XRecord && value instanceof this.constructor)) {
            throw new TypeError(`Expected ${this.__name}`);
        }
        const sortedValue = Array.from(this.__value).sort(([x], [y]) => {
            if (x < y)
                return -1;
            if (x > y)
                return 1;
            return 0;
        });
        for (const [k, v1] of sortedValue) {
            const v2 = value.__value.get(k);
            if (v2 === undefined)
                throw new TypeError();
            if (v1.__gt(v2))
                return true;
            if (v1.__lt(v2))
                return false;
        }
        return false;
    }
    __toString() {
        const members = Array.from(this.__value.entries())
            .sort(([x], [y]) => {
            if (x < y)
                return -1;
            if (x > y)
                return 1;
            return 0;
        })
            .map(([name, value]) => `${name}: ${value.__toString()}`)
            .join(", ");
        return `${this.__name} {${members}}`;
    }
}
//# sourceMappingURL=record.js.map