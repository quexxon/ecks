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
var _XFloat_value, _XFloat_state;
import XBoolean from "./boolean.js";
import XInteger from "./integer.js";
import XString from "./string.js";
function isNumber(value) {
    return value instanceof XInteger || value instanceof XFloat;
}
export default class XFloat {
    constructor(value, state) {
        this.kind = "float";
        _XFloat_value.set(this, void 0);
        _XFloat_state.set(this, void 0);
        __classPrivateFieldSet(this, _XFloat_value, value, "f");
        __classPrivateFieldSet(this, _XFloat_state, state, "f");
    }
    abs() {
        return this.__new(Math.abs(__classPrivateFieldGet(this, _XFloat_value, "f")));
    }
    int() {
        return new XInteger(__classPrivateFieldGet(this, _XFloat_value, "f"), __classPrivateFieldGet(this, _XFloat_state, "f"));
    }
    ceil() {
        return this.__new(Math.ceil(__classPrivateFieldGet(this, _XFloat_value, "f")));
    }
    floor() {
        return this.__new(Math.floor(__classPrivateFieldGet(this, _XFloat_value, "f")));
    }
    rnd() {
        return this.__new(Math.round(__classPrivateFieldGet(this, _XFloat_value, "f")));
    }
    ceili() {
        return new XInteger(Math.ceil(__classPrivateFieldGet(this, _XFloat_value, "f")), __classPrivateFieldGet(this, _XFloat_state, "f"));
    }
    floori() {
        return new XInteger(Math.floor(__classPrivateFieldGet(this, _XFloat_value, "f")), __classPrivateFieldGet(this, _XFloat_state, "f"));
    }
    rndi() {
        return new XInteger(Math.round(__classPrivateFieldGet(this, _XFloat_value, "f")), __classPrivateFieldGet(this, _XFloat_state, "f"));
    }
    sqrt() {
        return this.__new(Math.sqrt(__classPrivateFieldGet(this, _XFloat_value, "f")));
    }
    clamp(x, y) {
        if (__classPrivateFieldGet(this, _XFloat_value, "f") < x.__value)
            return this.__new(x.__value);
        if (__classPrivateFieldGet(this, _XFloat_value, "f") > y.__value)
            return this.__new(y.__value);
        return this;
    }
    str() {
        return new XString(this.__toString(), __classPrivateFieldGet(this, _XFloat_state, "f"));
    }
    [(_XFloat_value = new WeakMap(), _XFloat_state = new WeakMap(), Symbol.for("neg"))]() {
        return this.__new(-__classPrivateFieldGet(this, _XFloat_value, "f"));
    }
    [Symbol.for("+")](value) {
        if (!isNumber(value))
            throw new TypeError();
        return this.__new(__classPrivateFieldGet(this, _XFloat_value, "f") + value.__value);
    }
    [Symbol.for("-")](value) {
        if (!isNumber(value))
            throw new TypeError();
        return this.__new(__classPrivateFieldGet(this, _XFloat_value, "f") - value.__value);
    }
    [Symbol.for("*")](value) {
        if (!isNumber(value))
            throw new TypeError();
        return this.__new(__classPrivateFieldGet(this, _XFloat_value, "f") * value.__value);
    }
    [Symbol.for("/")](value) {
        if (!isNumber(value))
            throw new TypeError();
        return this.__new(__classPrivateFieldGet(this, _XFloat_value, "f") / value.__value);
    }
    [Symbol.for("%")](value) {
        if (!isNumber(value))
            throw new TypeError();
        return this.__new(__classPrivateFieldGet(this, _XFloat_value, "f") % value.__value);
    }
    [Symbol.for("^")](value) {
        if (!isNumber(value))
            throw new TypeError();
        return this.__new(Math.pow(__classPrivateFieldGet(this, _XFloat_value, "f"), value.__value));
    }
    [Symbol.for("=")](value) {
        return new XBoolean(this.__eq(value), __classPrivateFieldGet(this, _XFloat_state, "f"));
    }
    [Symbol.for("!=")](value) {
        return new XBoolean(!this.__eq(value), __classPrivateFieldGet(this, _XFloat_state, "f"));
    }
    [Symbol.for("<")](value) {
        return new XBoolean(this.__lt(value), __classPrivateFieldGet(this, _XFloat_state, "f"));
    }
    [Symbol.for("<=")](value) {
        return new XBoolean(this.__lt(value) || this.__eq(value), __classPrivateFieldGet(this, _XFloat_state, "f"));
    }
    [Symbol.for(">")](value) {
        return new XBoolean(this.__gt(value), __classPrivateFieldGet(this, _XFloat_state, "f"));
    }
    [Symbol.for(">=")](value) {
        return new XBoolean(this.__gt(value) || this.__eq(value), __classPrivateFieldGet(this, _XFloat_state, "f"));
    }
    get __value() {
        return __classPrivateFieldGet(this, _XFloat_value, "f");
    }
    __new(value) {
        return new XFloat(value, __classPrivateFieldGet(this, _XFloat_state, "f"));
    }
    __eq(value) {
        if (!isNumber(value))
            throw new TypeError("Expected a number");
        return __classPrivateFieldGet(this, _XFloat_value, "f") === value.__value;
    }
    __lt(value) {
        if (!isNumber(value))
            throw new TypeError("Expected a number");
        return __classPrivateFieldGet(this, _XFloat_value, "f") < value.__value;
    }
    __gt(value) {
        if (!isNumber(value))
            throw new TypeError("Expected a number");
        return __classPrivateFieldGet(this, _XFloat_value, "f") > value.__value;
    }
    __toString() {
        if (Math.trunc(__classPrivateFieldGet(this, _XFloat_value, "f")) === __classPrivateFieldGet(this, _XFloat_value, "f")) {
            return this.__value.toString() + ".0";
        }
        return __classPrivateFieldGet(this, _XFloat_value, "f").toString();
    }
}
//# sourceMappingURL=float.js.map