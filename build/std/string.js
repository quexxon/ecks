var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _a, _XString_escapeString, _XString_value, _XString_state;
import XArray from "./array.js";
import XBoolean from "./boolean.js";
import XInteger from "./integer.js";
import XOptional from "./optional.js";
export default class XString {
    constructor(value, state) {
        this.kind = "string";
        _XString_value.set(this, void 0);
        _XString_state.set(this, void 0);
        __classPrivateFieldSet(this, _XString_value, __classPrivateFieldGet(XString, _a, "m", _XString_escapeString).call(XString, value), "f");
        __classPrivateFieldSet(this, _XString_state, state, "f");
    }
    len() {
        return new XInteger(this.__length, __classPrivateFieldGet(this, _XString_state, "f"));
    }
    at(index) {
        if (!(index instanceof XInteger))
            throw new TypeError("Expected an integer");
        if (index.__value < 0 || index.__value >= __classPrivateFieldGet(this, _XString_value, "f").length) {
            return new XOptional(__classPrivateFieldGet(this, _XString_state, "f"));
        }
        return new XOptional(__classPrivateFieldGet(this, _XString_state, "f"), this.__new(__classPrivateFieldGet(this, _XString_value, "f")[index.__value]));
    }
    pad(length, fill) {
        if (!(length instanceof XInteger)) {
            throw new TypeError("Expected `length` to be an integer");
        }
        if (!(fill instanceof XString)) {
            throw new TypeError("Expected `fill` to be a string");
        }
        const leftWidth = Math.floor(length.__value / 2 + __classPrivateFieldGet(this, _XString_value, "f").length / 2);
        return this.__new(__classPrivateFieldGet(this, _XString_value, "f")
            .padStart(leftWidth, fill.__value)
            .padEnd(length.__value, fill.__value));
    }
    lpad(length, fill) {
        if (!(length instanceof XInteger)) {
            throw new TypeError("Expected `length` to be an integer");
        }
        if (!(fill instanceof XString)) {
            throw new TypeError("Expected `fill` to be a string");
        }
        return this.__new(__classPrivateFieldGet(this, _XString_value, "f").padStart(length.__value, fill.__value));
    }
    rpad(length, fill) {
        if (!(length instanceof XInteger)) {
            throw new TypeError("Expected `length` to be an integer");
        }
        if (!(fill instanceof XString)) {
            throw new TypeError("Expected `fill` to be a string");
        }
        return this.__new(__classPrivateFieldGet(this, _XString_value, "f").padEnd(length.__value, fill.__value));
    }
    trim() {
        return this.__new(__classPrivateFieldGet(this, _XString_value, "f").trim());
    }
    ltrim() {
        return this.__new(__classPrivateFieldGet(this, _XString_value, "f").trimStart());
    }
    rtrim() {
        return this.__new(__classPrivateFieldGet(this, _XString_value, "f").trimEnd());
    }
    lower() {
        return this.__new(__classPrivateFieldGet(this, _XString_value, "f").toLocaleLowerCase());
    }
    upper() {
        return this.__new(__classPrivateFieldGet(this, _XString_value, "f").toLocaleUpperCase());
    }
    split(delimiter) {
        if (!(delimiter instanceof XString))
            throw new TypeError("Expected a string");
        return new XArray(__classPrivateFieldGet(this, _XString_value, "f")
            .split(delimiter.__value)
            .map((str) => new XString(str, __classPrivateFieldGet(this, _XString_state, "f"))), __classPrivateFieldGet(this, _XString_state, "f"));
    }
    starts(prefix) {
        if (!(prefix instanceof XString))
            throw new TypeError("Expected a string");
        return new XBoolean(__classPrivateFieldGet(this, _XString_value, "f").startsWith(prefix.__value), __classPrivateFieldGet(this, _XString_state, "f"));
    }
    ends(suffix) {
        if (!(suffix instanceof XString))
            throw new TypeError("Expected a string");
        return new XBoolean(__classPrivateFieldGet(this, _XString_value, "f").endsWith(suffix.__value), __classPrivateFieldGet(this, _XString_state, "f"));
    }
    has(target) {
        if (!(target instanceof XString))
            throw new TypeError("Expected a string");
        return new XBoolean(__classPrivateFieldGet(this, _XString_value, "f").includes(target.__value), __classPrivateFieldGet(this, _XString_state, "f"));
    }
    rev() {
        return this.__new(Array.from(__classPrivateFieldGet(this, _XString_value, "f")).reverse().join(""));
    }
    [(_XString_value = new WeakMap(), _XString_state = new WeakMap(), _XString_escapeString = function _XString_escapeString(literal) {
        let start = 0;
        let end = 0;
        let isEscape = false;
        const segments = [];
        for (let i = 0; i < literal.length; i++) {
            const char = literal[i];
            if (isEscape) {
                segments.push(literal.slice(end, start));
                switch (char) {
                    case "n":
                        segments.push("\n");
                        end = i + 1;
                        break;
                    case "t":
                        segments.push("\t");
                        end = i + 1;
                        break;
                    default:
                        end = i;
                        break;
                }
                isEscape = false;
            }
            else if (char === "\\") {
                start = i;
                isEscape = true;
            }
        }
        segments.push(literal.slice(end));
        return segments.join("");
    }, Symbol.for("+"))](value) {
        if (!(value instanceof XString))
            throw new TypeError();
        return this.__new(__classPrivateFieldGet(this, _XString_value, "f") + value.__value);
    }
    [Symbol.for("=")](value) {
        return new XBoolean(this.__eq(value), __classPrivateFieldGet(this, _XString_state, "f"));
    }
    [Symbol.for("!=")](value) {
        return new XBoolean(!this.__eq(value), __classPrivateFieldGet(this, _XString_state, "f"));
    }
    [Symbol.for("<")](value) {
        return new XBoolean(this.__lt(value), __classPrivateFieldGet(this, _XString_state, "f"));
    }
    [Symbol.for("<=")](value) {
        return new XBoolean(this.__lt(value) || this.__eq(value), __classPrivateFieldGet(this, _XString_state, "f"));
    }
    [Symbol.for(">")](value) {
        return new XBoolean(this.__gt(value), __classPrivateFieldGet(this, _XString_state, "f"));
    }
    [Symbol.for(">=")](value) {
        return new XBoolean(this.__gt(value) || this.__eq(value), __classPrivateFieldGet(this, _XString_state, "f"));
    }
    get __value() {
        return __classPrivateFieldGet(this, _XString_value, "f");
    }
    get __length() {
        return __classPrivateFieldGet(this, _XString_value, "f").length;
    }
    __new(value) {
        return new XString(value, __classPrivateFieldGet(this, _XString_state, "f"));
    }
    __eq(value) {
        if (!(value instanceof XString))
            throw new TypeError(`Expected ${this.kind}`);
        return __classPrivateFieldGet(this, _XString_value, "f") === value.__value;
    }
    __lt(value) {
        if (!(value instanceof XString))
            throw new TypeError(`Expected ${this.kind}`);
        return __classPrivateFieldGet(this, _XString_value, "f") < value.__value;
    }
    __gt(value) {
        if (!(value instanceof XString))
            throw new TypeError(`Expected ${this.kind}`);
        return __classPrivateFieldGet(this, _XString_value, "f") > value.__value;
    }
    __toString() {
        if (__classPrivateFieldGet(this, _XString_value, "f").includes("'")) {
            return `"${__classPrivateFieldGet(this, _XString_value, "f")}"`;
        }
        else {
            return `'${__classPrivateFieldGet(this, _XString_value, "f")}'`;
        }
    }
}
_a = XString;
//# sourceMappingURL=string.js.map