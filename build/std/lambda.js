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
var _XLambda_value, _XLambda_state;
import { toString } from "../ast.js";
import Interpreter from "../interpreter.js";
import XBoolean from "./boolean.js";
export default class XLambda {
    constructor(value, state) {
        this.kind = "lambda";
        _XLambda_value.set(this, void 0);
        _XLambda_state.set(this, void 0);
        __classPrivateFieldSet(this, _XLambda_value, value, "f");
        __classPrivateFieldSet(this, _XLambda_state, state, "f");
    }
    apply(args) {
        return this.call(...args.__value);
    }
    call(...args) {
        if (args.length !== __classPrivateFieldGet(this, _XLambda_value, "f").params.length) {
            throw new Error(`Expected ${__classPrivateFieldGet(this, _XLambda_value, "f").params.length} arguments`);
        }
        const state = Object.assign(Object.assign({}, __classPrivateFieldGet(this, _XLambda_state, "f")), { environment: new Map(__classPrivateFieldGet(this, _XLambda_state, "f").environment) });
        for (let i = 0; i < args.length; i++) {
            const name = __classPrivateFieldGet(this, _XLambda_value, "f").params[i].name;
            const value = args[i];
            state.environment.set(name, value);
        }
        const interpreter = new Interpreter(__classPrivateFieldGet(this, _XLambda_value, "f").body, state);
        return interpreter.render();
    }
    [(_XLambda_value = new WeakMap(), _XLambda_state = new WeakMap(), Symbol.for("="))](value) {
        return new XBoolean(this.__eq(value), __classPrivateFieldGet(this, _XLambda_state, "f"));
    }
    [Symbol.for("!=")](value) {
        return new XBoolean(!this.__eq(value), __classPrivateFieldGet(this, _XLambda_state, "f"));
    }
    [Symbol.for("<")](value) {
        return new XBoolean(this.__lt(value), __classPrivateFieldGet(this, _XLambda_state, "f"));
    }
    [Symbol.for("<=")](value) {
        return new XBoolean(this.__lt(value) || this.__eq(value), __classPrivateFieldGet(this, _XLambda_state, "f"));
    }
    [Symbol.for(">")](value) {
        return new XBoolean(this.__gt(value), __classPrivateFieldGet(this, _XLambda_state, "f"));
    }
    [Symbol.for(">=")](value) {
        return new XBoolean(this.__gt(value) || this.__eq(value), __classPrivateFieldGet(this, _XLambda_state, "f"));
    }
    get __value() {
        return __classPrivateFieldGet(this, _XLambda_value, "f");
    }
    __eq(value) {
        if (!(value instanceof XLambda))
            throw new TypeError(`Expected ${this.kind}`);
        return this.__toString() === value.__toString();
    }
    __lt(value) {
        if (!(value instanceof XLambda))
            throw new TypeError(`Expected ${this.kind}`);
        return this.__toString() < value.__toString();
    }
    __gt(value) {
        if (!(value instanceof XLambda))
            throw new TypeError(`Expected ${this.kind}`);
        return this.__toString() > value.__toString();
    }
    __toString() {
        return `|${__classPrivateFieldGet(this, _XLambda_value, "f").params.map((x) => x.name).join(" ")}| ${toString(__classPrivateFieldGet(this, _XLambda_value, "f").body)}`;
    }
}
//# sourceMappingURL=lambda.js.map