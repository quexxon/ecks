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
var _XSet_value, _XSet_state;
import XBoolean from "./boolean.js";
import XInteger from "./integer.js";
import XLambda from "./lambda.js";
export default class XSet {
    constructor(value, state) {
        this.kind = "set";
        _XSet_value.set(this, void 0);
        _XSet_state.set(this, void 0);
        if (value.length > 1) {
            const first = value[0];
            if (!value.every((x) => x.kind === first.kind)) {
                throw new TypeError();
            }
        }
        value.sort((x, y) => {
            if (x.__lt(y))
                return -1;
            if (x.__gt(y))
                return 1;
            return 0;
        });
        __classPrivateFieldSet(this, _XSet_value, new Map(value.map((v) => [v.__toString(), v])), "f");
        __classPrivateFieldSet(this, _XSet_state, state, "f");
    }
    has(value) {
        if (value instanceof XLambda) {
            throw new TypeError();
        }
        return new XBoolean(__classPrivateFieldGet(this, _XSet_value, "f").has(value.__toString()), __classPrivateFieldGet(this, _XSet_state, "f"));
    }
    len() {
        return new XInteger(this.__length, __classPrivateFieldGet(this, _XSet_state, "f"));
    }
    union(value) {
        if (!(value instanceof XSet))
            throw new TypeError();
        if (value.__length === 0)
            return this;
        if (this.__length === 0)
            return value;
        if (value.__value.values().next().value.kind !==
            __classPrivateFieldGet(this, _XSet_value, "f").values().next().value.kind) {
            throw new TypeError();
        }
        return this.__new(Array.from(__classPrivateFieldGet(this, _XSet_value, "f").values()).concat(Array.from(value.__value.values())));
    }
    [(_XSet_value = new WeakMap(), _XSet_state = new WeakMap(), Symbol.for("+"))](value) {
        return this.union(value);
    }
    [Symbol.for("=")](value) {
        return new XBoolean(this.__eq(value), __classPrivateFieldGet(this, _XSet_state, "f"));
    }
    [Symbol.for("!=")](value) {
        return new XBoolean(!this.__eq(value), __classPrivateFieldGet(this, _XSet_state, "f"));
    }
    [Symbol.for("<")](value) {
        return new XBoolean(this.__lt(value), __classPrivateFieldGet(this, _XSet_state, "f"));
    }
    [Symbol.for("<=")](value) {
        return new XBoolean(this.__lt(value) || this.__eq(value), __classPrivateFieldGet(this, _XSet_state, "f"));
    }
    [Symbol.for(">")](value) {
        return new XBoolean(this.__gt(value), __classPrivateFieldGet(this, _XSet_state, "f"));
    }
    [Symbol.for(">=")](value) {
        return new XBoolean(this.__gt(value) || this.__eq(value), __classPrivateFieldGet(this, _XSet_state, "f"));
    }
    get __value() {
        return __classPrivateFieldGet(this, _XSet_value, "f");
    }
    get __length() {
        return __classPrivateFieldGet(this, _XSet_value, "f").size;
    }
    __new(value) {
        return new XSet(value, __classPrivateFieldGet(this, _XSet_state, "f"));
    }
    __eq(value) {
        if (!(value instanceof XSet))
            throw new TypeError(`Expected ${this.kind}`);
        if (this.__length !== value.__length)
            return false;
        const v1 = Array.from(__classPrivateFieldGet(this, _XSet_value, "f").values());
        const v2 = Array.from(value.__value.values());
        for (let i = 0; i < this.__length; i++) {
            if (!v1[i].__eq(v2[i]))
                return false;
        }
        return true;
    }
    __lt(value) {
        if (!(value instanceof XSet))
            throw new TypeError(`Expected ${this.kind}`);
        const v1 = Array.from(__classPrivateFieldGet(this, _XSet_value, "f").values());
        const v2 = Array.from(value.__value.values());
        const limit = Math.min(__classPrivateFieldGet(this, _XSet_value, "f").size, value.__value.size);
        for (let i = 0; i < limit; i++) {
            if (v1[i].__lt(v2[i]))
                return true;
            if (v1[i].__gt(v2[i]))
                return false;
        }
        return this.__length < value.__length;
    }
    __gt(value) {
        if (!(value instanceof XSet))
            throw new TypeError(`Expected ${this.kind}`);
        const v1 = Array.from(__classPrivateFieldGet(this, _XSet_value, "f").values());
        const v2 = Array.from(value.__value.values());
        const limit = Math.min(__classPrivateFieldGet(this, _XSet_value, "f").size, value.__value.size);
        for (let i = 0; i < limit; i++) {
            if (v1[i].__gt(v2[i]))
                return true;
            if (v1[i].__lt(v2[i]))
                return false;
        }
        return this.__length > value.__length;
    }
    __toString() {
        const values = Array.from(__classPrivateFieldGet(this, _XSet_value, "f").values());
        return `$[${values.map((x) => x.__toString()).join(" ")}]`;
    }
}
//# sourceMappingURL=set.js.map