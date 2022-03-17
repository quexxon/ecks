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
var _XMap_value, _XMap_keys, _XMap_state;
import XBoolean from "./boolean.js";
import XInteger from "./integer.js";
import XOptional from "./optional.js";
export default class XMap {
    constructor(value, state) {
        this.kind = "map";
        _XMap_value.set(this, void 0);
        _XMap_keys.set(this, void 0);
        _XMap_state.set(this, void 0);
        const keys = new Map();
        const values = new Map();
        if (value.length > 0) {
            value.sort(([x], [y]) => {
                if (x.__lt(y))
                    return -1;
                if (x.__gt(y))
                    return 1;
                return 0;
            });
            const [keyType, valType] = value[0].map((x) => x.kind);
            this.__keyType = keyType;
            this.__valType = valType;
            for (const [key, val] of value) {
                if (key.kind !== keyType || val.kind !== valType) {
                    throw new TypeError();
                }
                keys.set(key.__toString(), key);
                values.set(key.__toString(), val);
            }
        }
        __classPrivateFieldSet(this, _XMap_keys, keys, "f");
        __classPrivateFieldSet(this, _XMap_value, values, "f");
        __classPrivateFieldSet(this, _XMap_state, state, "f");
    }
    len() {
        return new XInteger(__classPrivateFieldGet(this, _XMap_value, "f").size, __classPrivateFieldGet(this, _XMap_state, "f"));
    }
    get(key) {
        if (this.__keyType !== undefined && key.kind !== this.__keyType) {
            throw new TypeError(`Expected a key of type ${this.__keyType}`);
        }
        return new XOptional(__classPrivateFieldGet(this, _XMap_state, "f"), __classPrivateFieldGet(this, _XMap_value, "f").get(key.__toString()));
    }
    del(key) {
        const targetKey = key.__toString();
        const entries = [];
        for (const [k, val] of __classPrivateFieldGet(this, _XMap_value, "f")) {
            const key = __classPrivateFieldGet(this, _XMap_keys, "f").get(k);
            if (key === undefined)
                throw new Error("Missing key");
            if (k !== targetKey) {
                entries.push([key, val]);
            }
        }
        return this.__new(entries);
    }
    set(key, value) {
        if (this.__keyType !== undefined && this.__keyType !== key.kind) {
            throw new TypeError(`Expected key of type ${this.__keyType}`);
        }
        if (this.__valType !== undefined && this.__valType !== value.kind) {
            throw new TypeError(`Expected value of type ${this.__valType}`);
        }
        const entries = [];
        for (const [k, val] of __classPrivateFieldGet(this, _XMap_value, "f")) {
            const key = __classPrivateFieldGet(this, _XMap_keys, "f").get(k);
            if (key === undefined)
                throw new Error("Missing key");
            entries.push([key, val]);
        }
        entries.push([key, value]);
        return this.__new(entries);
    }
    [(_XMap_value = new WeakMap(), _XMap_keys = new WeakMap(), _XMap_state = new WeakMap(), Symbol.for("="))](value) {
        return new XBoolean(this.__eq(value), __classPrivateFieldGet(this, _XMap_state, "f"));
    }
    [Symbol.for("!=")](value) {
        return new XBoolean(!this.__eq(value), __classPrivateFieldGet(this, _XMap_state, "f"));
    }
    [Symbol.for("<")](value) {
        return new XBoolean(this.__lt(value), __classPrivateFieldGet(this, _XMap_state, "f"));
    }
    [Symbol.for("<=")](value) {
        return new XBoolean(this.__lt(value) || this.__eq(value), __classPrivateFieldGet(this, _XMap_state, "f"));
    }
    [Symbol.for(">")](value) {
        return new XBoolean(this.__gt(value), __classPrivateFieldGet(this, _XMap_state, "f"));
    }
    [Symbol.for(">=")](value) {
        return new XBoolean(this.__gt(value) || this.__eq(value), __classPrivateFieldGet(this, _XMap_state, "f"));
    }
    [Symbol.for("+")](value) {
        var _a, _b;
        if (!(value instanceof XMap))
            throw new TypeError("Expected map");
        if (this.__length === 0)
            return value;
        if (value.__length === 0)
            return this;
        if (this.__keyType !== value.__keyType) {
            throw new TypeError(`Expected keys of type ${(_a = this.__keyType) !== null && _a !== void 0 ? _a : ""}`);
        }
        if (this.__valType !== value.__valType) {
            throw new TypeError(`Expected values of type ${(_b = this.__valType) !== null && _b !== void 0 ? _b : ""}`);
        }
        const entries = [];
        for (const [k, val] of __classPrivateFieldGet(this, _XMap_value, "f")) {
            const key = __classPrivateFieldGet(this, _XMap_keys, "f").get(k);
            if (key === undefined)
                throw new Error("Missing key");
            entries.push([key, val]);
        }
        for (const [k, val] of value.__value) {
            const key = value.__keys.get(k);
            if (key === undefined)
                throw new Error("Missing key");
            entries.push([key, val]);
        }
        return this.__new(entries);
    }
    get __value() {
        return __classPrivateFieldGet(this, _XMap_value, "f");
    }
    get __length() {
        return __classPrivateFieldGet(this, _XMap_value, "f").size;
    }
    get __keys() {
        return __classPrivateFieldGet(this, _XMap_keys, "f");
    }
    __new(value) {
        return new XMap(value, __classPrivateFieldGet(this, _XMap_state, "f"));
    }
    __eq(value) {
        if (!(value instanceof XMap))
            throw new TypeError("Expected map");
        for (const [k, v] of __classPrivateFieldGet(this, _XMap_value, "f")) {
            const val = value.__value.get(k);
            if (val === undefined || !v.__eq(val))
                return false;
        }
        return true;
    }
    __lt(value) {
        if (!(value instanceof XMap))
            throw new TypeError("Expected map");
        if (this.__length === 0 && value.__length === 0)
            return false;
        if (this.__length === 0)
            return true;
        const thisKeys = Array.from(__classPrivateFieldGet(this, _XMap_keys, "f").values());
        const thatKeys = Array.from(value.__keys.values());
        const limit = Math.min(this.__length, value.__length);
        for (let i = 0; i < limit; i++) {
            if (thisKeys[i].__lt(thatKeys[i]))
                return true;
            if (thisKeys[i].__gt(thatKeys[i]))
                return false;
            const key = thisKeys[i].__toString();
            const v1 = __classPrivateFieldGet(this, _XMap_value, "f").get(key);
            const v2 = value.__value.get(key);
            if (v1 === undefined || v2 === undefined)
                throw new Error();
            if (v1.__lt(v2))
                return true;
            if (v1.__gt(v2))
                return false;
        }
        return this.__length < value.__length;
    }
    __gt(value) {
        if (!(value instanceof XMap))
            throw new TypeError("Expected map");
        if (this.__length === 0 && value.__length === 0)
            return false;
        if (value.__length === 0)
            return true;
        const thisKeys = Array.from(__classPrivateFieldGet(this, _XMap_keys, "f").values());
        const thatKeys = Array.from(value.__keys.values());
        const limit = Math.min(this.__length, value.__length);
        for (let i = 0; i < limit; i++) {
            if (thisKeys[i].__gt(thatKeys[i]))
                return true;
            if (thisKeys[i].__lt(thatKeys[i]))
                return false;
            const key = thisKeys[i].__toString();
            const v1 = __classPrivateFieldGet(this, _XMap_value, "f").get(key);
            const v2 = value.__value.get(key);
            if (v1 === undefined || v2 === undefined)
                throw new Error();
            if (v1.__gt(v2))
                return true;
            if (v1.__lt(v2))
                return false;
        }
        return this.__length < value.__length;
    }
    __toString() {
        const entries = Array.from(__classPrivateFieldGet(this, _XMap_value, "f").entries())
            .map(([key, value]) => {
            return `${key}: ${value.__toString()}`;
        })
            .join(", ");
        return `{${entries}}`;
    }
}
//# sourceMappingURL=map.js.map