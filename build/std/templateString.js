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
var _XTemplateString_value, _XTemplateString_state;
import XString from "./string";
import * as Ecks from "../index";
export default class XTemplateString {
    constructor(value, state) {
        this.kind = "template_string";
        _XTemplateString_value.set(this, void 0);
        _XTemplateString_state.set(this, void 0);
        __classPrivateFieldSet(this, _XTemplateString_value, value, "f");
        __classPrivateFieldSet(this, _XTemplateString_state, state, "f");
    }
    evaluate(state) {
        const segments = [];
        let depth = 0;
        let start = 0;
        let end = 0;
        let isEscape = false;
        for (let i = 0; i < __classPrivateFieldGet(this, _XTemplateString_value, "f").length; i++) {
            if (isEscape) {
                isEscape = false;
                continue;
            }
            const char = __classPrivateFieldGet(this, _XTemplateString_value, "f")[i];
            if (char === "\\") {
                isEscape = true;
                continue;
            }
            if (char === "{") {
                if (depth === 0)
                    start = i;
                depth++;
            }
            if (char === "}") {
                depth--;
                if (depth < 0)
                    throw new SyntaxError("Unmatched `}` in template string");
                if (depth > 1)
                    continue;
                if (depth === 0) {
                    segments.push(__classPrivateFieldGet(this, _XTemplateString_value, "f").slice(end, start));
                    end = i + 1;
                    const expression = __classPrivateFieldGet(this, _XTemplateString_value, "f").slice(start + 1, i);
                    const value = Ecks.render(expression, state);
                    segments.push(value instanceof XString
                        ? value.__value
                        : value.__toString());
                }
            }
        }
        segments.push(__classPrivateFieldGet(this, _XTemplateString_value, "f").slice(end));
        return new XString(segments.join(""), __classPrivateFieldGet(this, _XTemplateString_state, "f"));
    }
    get __value() {
        return __classPrivateFieldGet(this, _XTemplateString_value, "f");
    }
    get __length() {
        return __classPrivateFieldGet(this, _XTemplateString_value, "f").length;
    }
    __eq(value) {
        if (!(value instanceof XTemplateString))
            throw new TypeError(`Expected ${this.kind}`);
        return __classPrivateFieldGet(this, _XTemplateString_value, "f") === value.__value;
    }
    __lt(value) {
        if (!(value instanceof XTemplateString))
            throw new TypeError(`Expected ${this.kind}`);
        return __classPrivateFieldGet(this, _XTemplateString_value, "f") < value.__value;
    }
    __gt(value) {
        if (!(value instanceof XTemplateString))
            throw new TypeError(`Expected ${this.kind}`);
        return __classPrivateFieldGet(this, _XTemplateString_value, "f") > value.__value;
    }
    __toString() {
        return __classPrivateFieldGet(this, _XTemplateString_value, "f").toString();
    }
}
_XTemplateString_value = new WeakMap(), _XTemplateString_state = new WeakMap();
//# sourceMappingURL=templateString.js.map