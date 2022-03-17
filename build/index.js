import Interpreter from "./interpreter.js";
import Parser from "./parser.js";
import Scanner from "./scanner.js";
import XArray from "./std/array.js";
import XBoolean from "./std/boolean.js";
import XFloat from "./std/float.js";
import XInteger from "./std/integer.js";
import XOptional from "./std/optional.js";
import XSet from "./std/set.js";
import XString from "./std/string.js";
import { XDate } from "./std/date.js";
import XMap from "./std/map.js";
import XRecord from "./std/record.js";
import XTuple from "./std/tuple.js";
function isTypeHint(value) {
    if (typeof value !== "object" || value === null)
        return false;
    const { kind } = value;
    return (typeof kind === "string" &&
        ["integer", "float", "optional", "record", "tuple"].includes(kind));
}
const defaultState = {
    environment: new Map(),
    records: new Map()
};
export const render = (source, state = defaultState) => {
    const scanner = new Scanner(source, state);
    const parser = new Parser(scanner.scan(), state);
    const interpreter = new Interpreter(parser.parse(), state);
    return interpreter.render();
};
export const fromJs = (value, state = defaultState) => {
    if (typeof value === "number") {
        if (Math.trunc(value) === value) {
            return new XInteger(value, state);
        }
        else {
            return new XFloat(value, state);
        }
    }
    if (typeof value === "boolean") {
        return new XBoolean(value, state);
    }
    if (typeof value === "string") {
        return new XString(value, state);
    }
    if (typeof value === "undefined") {
        return new XOptional(state);
    }
    if (Array.isArray(value)) {
        return new XArray(value.map((v) => fromJs(v, state)), state);
    }
    if (value instanceof Date) {
        return new XDate(value, state);
    }
    if (value instanceof Set) {
        return new XSet(Array.from(value).map((v) => fromJs(v, state)), state);
    }
    if (value instanceof Map) {
        return new XMap(Array.from(value.entries()).map(([k, v]) => {
            return [fromJs(k, state), fromJs(v, state)];
        }), state);
    }
    if (isTypeHint(value)) {
        switch (value.kind) {
            case "integer":
                return new XInteger(value.value, state);
            case "float":
                return new XFloat(value.value, state);
            case "optional":
                return new XOptional(state, fromJs(value.value, state));
            case "record": {
                const RecordType = state.records.get(value.name);
                if (typeof RecordType === "undefined") {
                    throw new Error(`No registered record named "${value.name}`);
                }
                const members = new Map([...value.value]
                    .map(([k, v]) => [k, fromJs(v, state)]));
                const record = new RecordType(members, state);
                return record;
            }
            case "tuple":
                return new XTuple(value.value.map((v) => fromJs(v, state)), state);
        }
    }
    throw new TypeError("Incompatible value");
};
export const toJs = (value) => {
    // eslint-disable-line  @typescript-eslint/no-explicit-any
    if (value instanceof XInteger ||
        value instanceof XFloat ||
        value instanceof XString ||
        value instanceof XBoolean ||
        value instanceof XDate) {
        return value.__value;
    }
    if (value instanceof XOptional) {
        if (value.__value === undefined)
            return undefined;
        return toJs(value.__value);
    }
    if (value instanceof XArray) {
        return value.__value.map(toJs);
    }
    if (value instanceof XSet) {
        return new Set(Array.from(value.__value.values()).map(toJs));
    }
    if (value instanceof XTuple) {
        return value.__value.map(toJs);
    }
    if (value instanceof XMap) {
        return Array.from(value.__value.entries()).reduce((map, [key, val]) => {
            map.set(toJs(value.__keys.get(key)), toJs(val));
            return map;
        }, new Map());
    }
    if (value instanceof XRecord) {
        return Array.from(value.__value.entries()).reduce((obj, [name, value]) => {
            // eslint-disable-line @typescript-eslint/no-explicit-any
            obj[name] = toJs(value);
            return obj;
        }, {});
    }
    throw new TypeError(`Tried to convert ${value}, but conversion not supported for ${value.kind}`);
};
//# sourceMappingURL=index.js.map