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
var _XBoolean_value, _XBoolean_state;
import XString from "./string.js";
export default class XBoolean {
    constructor(value, state) {
        this.kind = "boolean";
        _XBoolean_value.set(this, void 0);
        _XBoolean_state.set(this, void 0);
        __classPrivateFieldSet(this, _XBoolean_value, value, "f");
        __classPrivateFieldSet(this, _XBoolean_state, state, "f");
    }
    str() {
        return new XString(this.__toString(), __classPrivateFieldGet(this, _XBoolean_state, "f"));
    }
    [(_XBoolean_value = new WeakMap(), _XBoolean_state = new WeakMap(), Symbol.for("!"))]() {
        return this.__new(!__classPrivateFieldGet(this, _XBoolean_value, "f"));
    }
    [Symbol.for("=")](value) {
        return this.__new(this.__eq(value));
    }
    [Symbol.for("!=")](value) {
        return this.__new(!this.__eq(value));
    }
    [Symbol.for("or")](value) {
        if (!(value instanceof XBoolean))
            throw new TypeError(`Expected ${this.kind}`);
        return this.__new(__classPrivateFieldGet(this, _XBoolean_value, "f") || value.__value);
    }
    [Symbol.for("and")](value) {
        if (!(value instanceof XBoolean))
            throw new TypeError(`Expected ${this.kind}`);
        return this.__new(__classPrivateFieldGet(this, _XBoolean_value, "f") && value.__value);
    }
    [Symbol.for("<")](value) {
        return this.__new(this.__lt(value));
    }
    [Symbol.for("<=")](value) {
        return this.__new(this.__lt(value) || this.__eq(value));
    }
    [Symbol.for(">")](value) {
        return this.__new(this.__gt(value));
    }
    [Symbol.for(">=")](value) {
        return this.__new(this.__gt(value) || this.__eq(value));
    }
    get __value() {
        return __classPrivateFieldGet(this, _XBoolean_value, "f");
    }
    __new(value) {
        return new XBoolean(value, __classPrivateFieldGet(this, _XBoolean_state, "f"));
    }
    __eq(value) {
        if (!(value instanceof XBoolean))
            throw new TypeError(`Expected ${this.kind}`);
        return __classPrivateFieldGet(this, _XBoolean_value, "f") === value.__value;
    }
    __lt(value) {
        if (!(value instanceof XBoolean))
            throw new TypeError(`Expected ${this.kind}`);
        return !__classPrivateFieldGet(this, _XBoolean_value, "f") && value.__value;
    }
    __gt(value) {
        if (!(value instanceof XBoolean))
            throw new TypeError(`Expected ${this.kind}`);
        return __classPrivateFieldGet(this, _XBoolean_value, "f") && !value.__value;
    }
    __toString() {
        return __classPrivateFieldGet(this, _XBoolean_value, "f").toString();
    }
}
//# sourceMappingURL=boolean.js.map