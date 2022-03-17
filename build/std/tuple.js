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
var _XTuple_value, _XTuple_state;
import XBoolean from "./boolean.js";
import XInteger from "./integer.js";
export default class XTuple {
    constructor(value, state) {
        this.kind = "tuple";
        _XTuple_value.set(this, void 0);
        _XTuple_state.set(this, void 0);
        __classPrivateFieldSet(this, _XTuple_value, value, "f");
        __classPrivateFieldSet(this, _XTuple_state, state, "f");
    }
    at(index) {
        if (!(index instanceof XInteger))
            throw new TypeError();
        if (index.__value < 0 || index.__value >= __classPrivateFieldGet(this, _XTuple_value, "f").length) {
            throw new TypeError("Invalid index");
        }
        return __classPrivateFieldGet(this, _XTuple_value, "f")[index.__value];
    }
    len() {
        return new XInteger(this.__length, __classPrivateFieldGet(this, _XTuple_state, "f"));
    }
    [(_XTuple_value = new WeakMap(), _XTuple_state = new WeakMap(), Symbol.for("="))](value) {
        return new XBoolean(this.__eq(value), __classPrivateFieldGet(this, _XTuple_state, "f"));
    }
    [Symbol.for("!=")](value) {
        return new XBoolean(!this.__eq(value), __classPrivateFieldGet(this, _XTuple_state, "f"));
    }
    [Symbol.for("<")](value) {
        return new XBoolean(this.__lt(value), __classPrivateFieldGet(this, _XTuple_state, "f"));
    }
    [Symbol.for("<=")](value) {
        return new XBoolean(this.__lt(value) || this.__eq(value), __classPrivateFieldGet(this, _XTuple_state, "f"));
    }
    [Symbol.for(">")](value) {
        return new XBoolean(this.__gt(value), __classPrivateFieldGet(this, _XTuple_state, "f"));
    }
    [Symbol.for(">=")](value) {
        return new XBoolean(this.__gt(value) || this.__eq(value), __classPrivateFieldGet(this, _XTuple_state, "f"));
    }
    get __value() {
        return __classPrivateFieldGet(this, _XTuple_value, "f");
    }
    get __length() {
        return __classPrivateFieldGet(this, _XTuple_value, "f").length;
    }
    __new(value) {
        return new XTuple(value, __classPrivateFieldGet(this, _XTuple_state, "f"));
    }
    __eq(value) {
        if (!(value instanceof XTuple))
            throw new TypeError(`Expected ${this.kind}`);
        if (this.__length !== value.__length)
            return false;
        for (let i = 0; i < this.__length; i++) {
            if (!__classPrivateFieldGet(this, _XTuple_value, "f")[i].__eq(value.__value[i]))
                return false;
        }
        return true;
    }
    __lt(value) {
        if (!(value instanceof XTuple))
            throw new TypeError(`Expected ${this.kind}`);
        const limit = Math.min(this.__length, value.__length);
        for (let i = 0; i < limit; i++) {
            if (__classPrivateFieldGet(this, _XTuple_value, "f")[i].__lt(value.__value[i]))
                return true;
        }
        return false;
    }
    __gt(value) {
        if (!(value instanceof XTuple))
            throw new TypeError(`Expected ${this.kind}`);
        const limit = Math.min(this.__length, value.__length);
        for (let i = 0; i < limit; i++) {
            if (__classPrivateFieldGet(this, _XTuple_value, "f")[i].__gt(value.__value[i]))
                return true;
        }
        return false;
    }
    __toString() {
        return `@[${__classPrivateFieldGet(this, _XTuple_value, "f").map((x) => x.__toString()).join(" ")}]`;
    }
}
//# sourceMappingURL=tuple.js.map