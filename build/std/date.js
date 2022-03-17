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
var _XDate_value, _XDate_state;
export class XDate {
    constructor(value, state) {
        this.kind = "date";
        _XDate_value.set(this, void 0);
        _XDate_state.set(this, void 0);
        __classPrivateFieldSet(this, _XDate_value, value, "f");
        __classPrivateFieldSet(this, _XDate_state, state, "f");
    }
    __new(value, state) {
        return new XDate(value, state);
    }
    __state() {
        return __classPrivateFieldGet(this, _XDate_state, "f");
    }
    __eq() {
        return false;
    }
    __lt(value) {
        if (!(value instanceof XDate)) {
            throw new TypeError();
        }
        return __classPrivateFieldGet(this, _XDate_value, "f") < value.__value;
    }
    __gt(value) {
        if (!(value instanceof XDate)) {
            throw new TypeError();
        }
        return __classPrivateFieldGet(this, _XDate_value, "f") > value.__value;
    }
    get __value() {
        if (!(__classPrivateFieldGet(this, _XDate_value, "f") instanceof Date)) {
            throw new TypeError();
        }
        return __classPrivateFieldGet(this, _XDate_value, "f");
    }
    __toString() {
        return __classPrivateFieldGet(this, _XDate_value, "f").toLocaleString();
    }
}
_XDate_value = new WeakMap(), _XDate_state = new WeakMap();
//# sourceMappingURL=date.js.map