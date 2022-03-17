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
var _XOptional_value, _XOptional_state;
import XBoolean from "./boolean.js";
import XLambda from "./lambda.js";
export default class XOptional {
    constructor(state, value) {
        this.kind = "optional";
        _XOptional_value.set(this, void 0);
        _XOptional_state.set(this, void 0);
        __classPrivateFieldSet(this, _XOptional_state, state, "f");
        __classPrivateFieldSet(this, _XOptional_value, value, "f");
    }
    map(fn) {
        if (!(fn instanceof XLambda))
            throw new TypeError("Expected a lambda");
        if (fn.__value.params.length !== 1) {
            throw new TypeError("Expected a single parameter");
        }
        if (__classPrivateFieldGet(this, _XOptional_value, "f") === undefined)
            return this.__new();
        return this.__new(fn.call(__classPrivateFieldGet(this, _XOptional_value, "f")));
    }
    [(_XOptional_value = new WeakMap(), _XOptional_state = new WeakMap(), Symbol.for("="))](value) {
        return new XBoolean(this.__eq(value), __classPrivateFieldGet(this, _XOptional_state, "f"));
    }
    [Symbol.for("!=")](value) {
        return new XBoolean(!this.__eq(value), __classPrivateFieldGet(this, _XOptional_state, "f"));
    }
    [Symbol.for("<")](value) {
        return new XBoolean(this.__lt(value), __classPrivateFieldGet(this, _XOptional_state, "f"));
    }
    [Symbol.for("<=")](value) {
        return new XBoolean(this.__lt(value) || this.__eq(value), __classPrivateFieldGet(this, _XOptional_state, "f"));
    }
    [Symbol.for(">")](value) {
        return new XBoolean(this.__gt(value), __classPrivateFieldGet(this, _XOptional_state, "f"));
    }
    [Symbol.for(">=")](value) {
        return new XBoolean(this.__gt(value) || this.__eq(value), __classPrivateFieldGet(this, _XOptional_state, "f"));
    }
    [Symbol.for("??")](value) {
        return __classPrivateFieldGet(this, _XOptional_value, "f") === undefined ? value : __classPrivateFieldGet(this, _XOptional_value, "f");
    }
    get __value() {
        return __classPrivateFieldGet(this, _XOptional_value, "f");
    }
    __new(value) {
        return new XOptional(__classPrivateFieldGet(this, _XOptional_state, "f"), value);
    }
    __eq(value) {
        if (!(value instanceof XOptional))
            throw new TypeError(`Expected ${this.kind}`);
        if (__classPrivateFieldGet(this, _XOptional_value, "f") === undefined && value.__value === undefined)
            return true;
        if (__classPrivateFieldGet(this, _XOptional_value, "f") === undefined || value.__value === undefined)
            return false;
        return __classPrivateFieldGet(this, _XOptional_value, "f").__eq(value.__value);
    }
    __lt(value) {
        if (!(value instanceof XOptional))
            throw new TypeError(`Expected ${this.kind}`);
        if (__classPrivateFieldGet(this, _XOptional_value, "f") === undefined && value.__value === undefined)
            return false;
        if (__classPrivateFieldGet(this, _XOptional_value, "f") === undefined || value.__value === undefined) {
            return __classPrivateFieldGet(this, _XOptional_value, "f") === undefined;
        }
        return __classPrivateFieldGet(this, _XOptional_value, "f").__lt(value.__value);
    }
    __gt(value) {
        if (!(value instanceof XOptional))
            throw new TypeError(`Expected ${this.kind}`);
        if (__classPrivateFieldGet(this, _XOptional_value, "f") === undefined && value.__value === undefined)
            return false;
        if (__classPrivateFieldGet(this, _XOptional_value, "f") === undefined || value.__value === undefined) {
            return __classPrivateFieldGet(this, _XOptional_value, "f") !== undefined;
        }
        return __classPrivateFieldGet(this, _XOptional_value, "f").__gt(value.__value);
    }
    __toString() {
        if (__classPrivateFieldGet(this, _XOptional_value, "f") === undefined)
            return "none";
        return `some(${__classPrivateFieldGet(this, _XOptional_value, "f").__toString()})`;
    }
}
//# sourceMappingURL=optional.js.map