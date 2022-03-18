var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _XArray_valueType, _XArray_value, _XArray_state;
import XBoolean from "./boolean.js";
import XInteger from "./integer.js";
import XLambda from "./lambda.js";
import XOptional from "./optional.js";
import XSet from "./set.js";
import XString from "./string.js";
export default class XArray {
    constructor(value, state) {
        this.kind = "array";
        _XArray_valueType.set(this, void 0);
        _XArray_value.set(this, void 0);
        _XArray_state.set(this, void 0);
        if (value.length > 0) {
            __classPrivateFieldSet(this, _XArray_valueType, value[0].kind, "f");
            if (!value.every((x) => x.kind === __classPrivateFieldGet(this, _XArray_valueType, "f"))) {
                throw new TypeError();
            }
        }
        __classPrivateFieldSet(this, _XArray_value, value, "f");
        __classPrivateFieldSet(this, _XArray_state, state, "f");
    }
    at(index) {
        if (!(index instanceof XInteger))
            throw new TypeError();
        const value = index.__value >= 0 && index.__value < __classPrivateFieldGet(this, _XArray_value, "f").length
            ? __classPrivateFieldGet(this, _XArray_value, "f")[index.__value]
            : undefined;
        return new XOptional(__classPrivateFieldGet(this, _XArray_state, "f"), value);
    }
    set(index, value) {
        if (!(index instanceof XInteger))
            throw new TypeError();
        if (__classPrivateFieldGet(this, _XArray_valueType, "f") !== undefined && __classPrivateFieldGet(this, _XArray_valueType, "f") !== value.kind) {
            throw new TypeError(`Expected a value of type ${__classPrivateFieldGet(this, _XArray_valueType, "f")}`);
        }
        let i = index.__value;
        // Negative values of i index the end of the array
        if (i < 0)
            i = __classPrivateFieldGet(this, _XArray_value, "f").length + i;
        if (i >= 0 && i < __classPrivateFieldGet(this, _XArray_value, "f").length) {
            return this.__new([
                ...__classPrivateFieldGet(this, _XArray_value, "f").slice(0, i),
                value,
                ...__classPrivateFieldGet(this, _XArray_value, "f").slice(i + 1)
            ]);
        }
        return this;
    }
    len() {
        return new XInteger(__classPrivateFieldGet(this, _XArray_value, "f").length, __classPrivateFieldGet(this, _XArray_state, "f"));
    }
    empty() {
        return new XBoolean(__classPrivateFieldGet(this, _XArray_value, "f").length === 0, __classPrivateFieldGet(this, _XArray_state, "f"));
    }
    push(value) {
        if (__classPrivateFieldGet(this, _XArray_valueType, "f") === undefined) {
            __classPrivateFieldSet(this, _XArray_valueType, value.kind, "f");
            return this.__new([value]);
        }
        if (value.kind !== __classPrivateFieldGet(this, _XArray_valueType, "f"))
            throw new TypeError();
        const array = Array.from(__classPrivateFieldGet(this, _XArray_value, "f"));
        array.push(value);
        return this.__new(array);
    }
    last() {
        if (this.__value.length > 0) {
            return new XOptional(__classPrivateFieldGet(this, _XArray_state, "f"), __classPrivateFieldGet(this, _XArray_value, "f")[__classPrivateFieldGet(this, _XArray_value, "f").length - 1]);
        }
        else {
            return new XOptional(__classPrivateFieldGet(this, _XArray_state, "f"));
        }
    }
    slice(start, end) {
        if (!(start instanceof XInteger))
            throw new TypeError();
        if (end === undefined) {
            return this.__new(__classPrivateFieldGet(this, _XArray_value, "f").slice(start.__value));
        }
        if (!(end instanceof XInteger))
            throw new TypeError();
        return this.__new(__classPrivateFieldGet(this, _XArray_value, "f").slice(start.__value, end.__value));
    }
    map(lambda) {
        return this.__new(__classPrivateFieldGet(this, _XArray_value, "f").map((v) => lambda.call(v)));
    }
    mapi(lambda) {
        return this.__new(__classPrivateFieldGet(this, _XArray_value, "f").map((v, i) => lambda.call(v, new XInteger(i, __classPrivateFieldGet(this, _XArray_state, "f")))));
    }
    keep(lambda) {
        return this.__new(__classPrivateFieldGet(this, _XArray_value, "f").filter((v) => {
            const resp = lambda.call(v);
            if (!(resp instanceof XBoolean)) {
                throw new Error("Lambda must return a boolean");
            }
            return resp.__value;
        }));
    }
    fold(accumulator, lambda) {
        return __classPrivateFieldGet(this, _XArray_value, "f").reduce((acc, v) => lambda.call(acc, v), accumulator);
    }
    drop(lambda) {
        return this.__new(__classPrivateFieldGet(this, _XArray_value, "f").filter((v) => {
            const resp = lambda.call(v);
            if (!(resp instanceof XBoolean)) {
                throw new Error("Lambda must return a boolean");
            }
            return !resp.__value;
        }));
    }
    all(lambda) {
        if (!(lambda instanceof XLambda))
            throw new TypeError();
        return new XBoolean(__classPrivateFieldGet(this, _XArray_value, "f").every((x) => {
            const result = lambda.call(x);
            if (!(result instanceof XBoolean))
                throw new TypeError();
            return result.__value;
        }), __classPrivateFieldGet(this, _XArray_state, "f"));
    }
    any(lambda) {
        if (!(lambda instanceof XLambda))
            throw new TypeError();
        return new XBoolean(__classPrivateFieldGet(this, _XArray_value, "f").some((x) => {
            const result = lambda.call(x);
            if (!(result instanceof XBoolean))
                throw new TypeError();
            return result.__value;
        }), __classPrivateFieldGet(this, _XArray_state, "f"));
    }
    nany(lambda) {
        return new XBoolean(!this.any(lambda).__value, __classPrivateFieldGet(this, _XArray_state, "f"));
    }
    rev() {
        return this.__new([...__classPrivateFieldGet(this, _XArray_value, "f")].reverse());
    }
    find(lambda) {
        const result = __classPrivateFieldGet(this, _XArray_value, "f").find((v) => {
            const resp = lambda.call(v);
            if (!(resp instanceof XBoolean)) {
                throw new Error("Lambda must return a boolean");
            }
            return resp.__value;
        });
        if (result === undefined)
            return new XOptional(__classPrivateFieldGet(this, _XArray_state, "f"));
        return new XOptional(__classPrivateFieldGet(this, _XArray_state, "f"), result);
    }
    rfind(lambda) {
        for (let i = __classPrivateFieldGet(this, _XArray_value, "f").length - 1; i >= 0; i--) {
            const entry = __classPrivateFieldGet(this, _XArray_value, "f")[i];
            const resp = lambda.call(entry);
            if (!(resp instanceof XBoolean)) {
                throw new Error("Lambda must return a boolean");
            }
            if (resp.__value)
                return new XOptional(__classPrivateFieldGet(this, _XArray_state, "f"), entry);
        }
        return new XOptional(__classPrivateFieldGet(this, _XArray_state, "f"));
    }
    findi(lambda) {
        const result = __classPrivateFieldGet(this, _XArray_value, "f").findIndex((v) => {
            const resp = lambda.call(v);
            if (!(resp instanceof XBoolean)) {
                throw new Error("Lambda must return a boolean");
            }
            return resp.__value;
        });
        if (result === -1)
            return new XOptional(__classPrivateFieldGet(this, _XArray_state, "f"));
        return new XOptional(__classPrivateFieldGet(this, _XArray_state, "f"), new XInteger(result, __classPrivateFieldGet(this, _XArray_state, "f")));
    }
    rfindi(lambda) {
        for (let i = __classPrivateFieldGet(this, _XArray_value, "f").length - 1; i >= 0; i--) {
            const entry = __classPrivateFieldGet(this, _XArray_value, "f")[i];
            const resp = lambda.call(entry);
            if (!(resp instanceof XBoolean)) {
                throw new Error("Lambda must return a boolean");
            }
            if (resp.__value) {
                return new XOptional(__classPrivateFieldGet(this, _XArray_state, "f"), new XInteger(i, __classPrivateFieldGet(this, _XArray_state, "f")));
            }
        }
        return new XOptional(__classPrivateFieldGet(this, _XArray_state, "f"));
    }
    sort() {
        return this.__new(Array.from(__classPrivateFieldGet(this, _XArray_value, "f")).sort((x, y) => {
            if (x.__lt(y))
                return -1;
            if (x.__gt(y))
                return 1;
            return 0;
        }));
    }
    rsort() {
        return this.__new(Array.from(__classPrivateFieldGet(this, _XArray_value, "f")).sort((x, y) => {
            if (x.__gt(y))
                return -1;
            if (x.__lt(y))
                return 1;
            return 0;
        }));
    }
    sortby(comparator) {
        if (!(comparator instanceof XLambda))
            throw new TypeError();
        return this.__new(Array.from(__classPrivateFieldGet(this, _XArray_value, "f")).sort((x, y) => {
            const value = comparator.call(x, y).__value;
            if (typeof value !== "number") {
                throw new TypeError();
            }
            return value;
        }));
    }
    uniq() {
        const array = [];
        const set = new Set();
        for (const entry of __classPrivateFieldGet(this, _XArray_value, "f")) {
            if (!set.has(entry.__toString())) {
                array.push(entry);
                set.add(entry.__toString());
            }
        }
        return this.__new(array);
    }
    toset() {
        return new XSet(__classPrivateFieldGet(this, _XArray_value, "f"), __classPrivateFieldGet(this, _XArray_state, "f"));
    }
    join(string) {
        if (!(string instanceof XString))
            throw new TypeError();
        return new XString(__classPrivateFieldGet(this, _XArray_value, "f")
            .map((v) => (v.kind === "string" ? v.__value : v.__toString()))
            .join(string.__value), __classPrivateFieldGet(this, _XArray_state, "f"));
    }
    flat() {
        const array = [];
        for (const entry of __classPrivateFieldGet(this, _XArray_value, "f")) {
            if (entry instanceof XArray) {
                array.push(...entry.flat().__value);
            }
            else {
                array.push(entry);
            }
        }
        return this.__new(array);
    }
    [(_XArray_valueType = new WeakMap(), _XArray_value = new WeakMap(), _XArray_state = new WeakMap(), Symbol.for("="))](value) {
        return new XBoolean(this.__eq(value), __classPrivateFieldGet(this, _XArray_state, "f"));
    }
    [Symbol.for("!=")](value) {
        return new XBoolean(!this.__eq(value), __classPrivateFieldGet(this, _XArray_state, "f"));
    }
    [Symbol.for("<")](value) {
        return new XBoolean(this.__lt(value), __classPrivateFieldGet(this, _XArray_state, "f"));
    }
    [Symbol.for("<=")](value) {
        return new XBoolean(this.__lt(value) || this.__eq(value), __classPrivateFieldGet(this, _XArray_state, "f"));
    }
    [Symbol.for(">")](value) {
        return new XBoolean(this.__gt(value), __classPrivateFieldGet(this, _XArray_state, "f"));
    }
    [Symbol.for(">=")](value) {
        return new XBoolean(this.__gt(value) || this.__eq(value), __classPrivateFieldGet(this, _XArray_state, "f"));
    }
    [Symbol.for("+")](value) {
        if (!(value instanceof XArray))
            throw new TypeError();
        if (value.__length === 0)
            return this;
        if (this.__length === 0)
            return value;
        if (value.__value[0].kind !== __classPrivateFieldGet(this, _XArray_value, "f")[0].kind)
            throw new TypeError();
        return this.__new(__classPrivateFieldGet(this, _XArray_value, "f").concat(value.__value));
    }
    [Symbol.for("*")](value) {
        if (!(value instanceof XInteger))
            throw new TypeError();
        if (value.__value < 0)
            throw new Error("Cannot multiply array by a negative integer");
        const array = [];
        for (let n = 0; n < value.__value; n++)
            array.push(...__classPrivateFieldGet(this, _XArray_value, "f"));
        return this.__new(array);
    }
    get __value() {
        return __classPrivateFieldGet(this, _XArray_value, "f");
    }
    get __valueType() {
        return __classPrivateFieldGet(this, _XArray_valueType, "f");
    }
    get __length() {
        return __classPrivateFieldGet(this, _XArray_value, "f").length;
    }
    __new(value) {
        return new XArray(value, __classPrivateFieldGet(this, _XArray_state, "f"));
    }
    __eq(value) {
        if (!(value instanceof XArray))
            throw new TypeError(`Expected ${this.kind}`);
        if (this.__length !== value.__length)
            return false;
        for (let i = 0; i < this.__length; i++) {
            if (!__classPrivateFieldGet(this, _XArray_value, "f")[i].__eq(value.__value[i]))
                return false;
        }
        return true;
    }
    __lt(value) {
        if (!(value instanceof XArray))
            throw new TypeError(`Expected ${this.kind}`);
        const limit = Math.min(this.__length, value.__length);
        for (let i = 0; i < limit; i++) {
            if (__classPrivateFieldGet(this, _XArray_value, "f")[i].__lt(value.__value[i]))
                return true;
            if (__classPrivateFieldGet(this, _XArray_value, "f")[i].__gt(value.__value[i]))
                return false;
        }
        return false;
    }
    __gt(value) {
        if (!(value instanceof XArray))
            throw new TypeError(`Expected ${this.kind}`);
        const limit = Math.min(this.__length, value.__length);
        for (let i = 0; i < limit; i++) {
            if (__classPrivateFieldGet(this, _XArray_value, "f")[i].__gt(value.__value[i]))
                return true;
            if (__classPrivateFieldGet(this, _XArray_value, "f")[i].__lt(value.__value[i]))
                return false;
        }
        return false;
    }
    __toString() {
        return `[${__classPrivateFieldGet(this, _XArray_value, "f").map((x) => x.__toString()).join(" ")}]`;
    }
}
//# sourceMappingURL=array.js.map