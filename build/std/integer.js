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
var _XInteger_value, _XInteger_state;
import XBoolean from "./boolean.js";
import XFloat from "./float.js";
import XString from "./string.js";
function isNumber(value) {
    return value instanceof XInteger || value instanceof XFloat;
}
export default class XInteger {
    constructor(value, state) {
        this.kind = "integer";
        _XInteger_value.set(this, void 0);
        _XInteger_state.set(this, void 0);
        __classPrivateFieldSet(this, _XInteger_value, Math.trunc(value), "f");
        __classPrivateFieldSet(this, _XInteger_state, state, "f");
    }
    float() {
        return new XFloat(__classPrivateFieldGet(this, _XInteger_value, "f"), __classPrivateFieldGet(this, _XInteger_state, "f"));
    }
    str() {
        return new XString(this.__toString(), __classPrivateFieldGet(this, _XInteger_state, "f"));
    }
    abs() {
        return this.__new(Math.abs(__classPrivateFieldGet(this, _XInteger_value, "f")));
    }
    clamp(x, y) {
        if (__classPrivateFieldGet(this, _XInteger_value, "f") < x.__value)
            return this.__new(x.__value);
        if (__classPrivateFieldGet(this, _XInteger_value, "f") > y.__value)
            return this.__new(y.__value);
        return this;
    }
    sqrt() {
        return new XFloat(Math.sqrt(__classPrivateFieldGet(this, _XInteger_value, "f")), __classPrivateFieldGet(this, _XInteger_state, "f"));
    }
    pow(exp) {
        return new XFloat(Math.pow(__classPrivateFieldGet(this, _XInteger_value, "f"), exp.__value), __classPrivateFieldGet(this, _XInteger_state, "f")); // Raising to a non-integer power produces a float
    }
    [(_XInteger_value = new WeakMap(), _XInteger_state = new WeakMap(), Symbol.for("neg"))]() {
        return this.__new(-__classPrivateFieldGet(this, _XInteger_value, "f"));
    }
    [Symbol.for("+")](value) {
        if (!isNumber(value))
            throw new TypeError();
        const n = __classPrivateFieldGet(this, _XInteger_value, "f") + value.__value;
        return value instanceof XFloat
            ? new XFloat(n, __classPrivateFieldGet(this, _XInteger_state, "f"))
            : this.__new(n);
    }
    [Symbol.for("-")](value) {
        if (!isNumber(value))
            throw new TypeError();
        const n = __classPrivateFieldGet(this, _XInteger_value, "f") - value.__value;
        return value instanceof XFloat
            ? new XFloat(n, __classPrivateFieldGet(this, _XInteger_state, "f"))
            : this.__new(n);
    }
    [Symbol.for("*")](value) {
        if (!isNumber(value))
            throw new TypeError();
        const n = __classPrivateFieldGet(this, _XInteger_value, "f") * value.__value;
        return value instanceof XFloat
            ? new XFloat(n, __classPrivateFieldGet(this, _XInteger_state, "f"))
            : this.__new(n);
    }
    [Symbol.for("/")](value) {
        if (!isNumber(value))
            throw new TypeError();
        if (value instanceof XFloat) {
            return new XFloat(__classPrivateFieldGet(this, _XInteger_value, "f") / value.__value, __classPrivateFieldGet(this, _XInteger_state, "f"));
        }
        return this.__new(Math.trunc(__classPrivateFieldGet(this, _XInteger_value, "f") / value.__value));
    }
    [Symbol.for("%")](value) {
        if (!isNumber(value))
            throw new TypeError();
        const n = __classPrivateFieldGet(this, _XInteger_value, "f") % value.__value;
        return value instanceof XFloat
            ? new XFloat(n, __classPrivateFieldGet(this, _XInteger_state, "f"))
            : this.__new(n);
    }
    [Symbol.for("^")](value) {
        if (!isNumber(value))
            throw new TypeError();
        const n = Math.pow(__classPrivateFieldGet(this, _XInteger_value, "f"), value.__value);
        return value instanceof XFloat
            ? new XFloat(n, __classPrivateFieldGet(this, _XInteger_state, "f"))
            : this.__new(n);
    }
    [Symbol.for("=")](value) {
        return new XBoolean(this.__eq(value), __classPrivateFieldGet(this, _XInteger_state, "f"));
    }
    [Symbol.for("!=")](value) {
        return new XBoolean(!this.__eq(value), __classPrivateFieldGet(this, _XInteger_state, "f"));
    }
    [Symbol.for("<")](value) {
        return new XBoolean(this.__lt(value), __classPrivateFieldGet(this, _XInteger_state, "f"));
    }
    [Symbol.for("<=")](value) {
        return new XBoolean(this.__lt(value) || this.__eq(value), __classPrivateFieldGet(this, _XInteger_state, "f"));
    }
    [Symbol.for(">")](value) {
        return new XBoolean(this.__gt(value), __classPrivateFieldGet(this, _XInteger_state, "f"));
    }
    [Symbol.for(">=")](value) {
        return new XBoolean(this.__gt(value) || this.__eq(value), __classPrivateFieldGet(this, _XInteger_state, "f"));
    }
    get __value() {
        return __classPrivateFieldGet(this, _XInteger_value, "f");
    }
    __new(value) {
        return new XInteger(value, __classPrivateFieldGet(this, _XInteger_state, "f"));
    }
    __eq(value) {
        if (!isNumber(value))
            throw new TypeError("Expected a number");
        return __classPrivateFieldGet(this, _XInteger_value, "f") === value.__value;
    }
    __lt(value) {
        if (!isNumber(value))
            throw new TypeError("Expected a number");
        return __classPrivateFieldGet(this, _XInteger_value, "f") < value.__value;
    }
    __gt(value) {
        if (!isNumber(value))
            throw new TypeError("Expected a number");
        return __classPrivateFieldGet(this, _XInteger_value, "f") > value.__value;
    }
    __toString() {
        return __classPrivateFieldGet(this, _XInteger_value, "f").toString();
    }
}
//# sourceMappingURL=integer.js.map