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
var _Point_x, _Point_y;
import * as ReadLine from "readline";
import * as Chalk from "chalk";
import * as Ecks from ".";
import XArray from "./std/array";
import XBoolean from "./std/boolean";
import XFloat from "./std/float";
import XInteger from "./std/integer";
import XMap from "./std/map";
import XOptional from "./std/optional";
import XSet from "./std/set";
import XString from "./std/string";
import XRecord from "./std/record";
import XTuple from "./std/tuple";
// Example record
class Point extends XRecord {
    constructor(value, state) {
        super(value, state);
        _Point_x.set(this, void 0);
        _Point_y.set(this, void 0);
        const x = value.get("x");
        if (x === undefined ||
            !(x instanceof XInteger || x instanceof XFloat)) {
            throw new TypeError();
        }
        const y = value.get("y");
        if (y === undefined ||
            !(y instanceof XInteger || y instanceof XFloat)) {
            throw new TypeError();
        }
        if (value.size > 2)
            throw new TypeError();
        if (x.kind !== y.kind)
            throw new TypeError();
        __classPrivateFieldSet(this, _Point_x, x, "f");
        __classPrivateFieldSet(this, _Point_y, y, "f");
    }
    __new(value) {
        return new Point(value, this.__state);
    }
    x() {
        return __classPrivateFieldGet(this, _Point_x, "f");
    }
    y() {
        return __classPrivateFieldGet(this, _Point_y, "f");
    }
    str() {
        return new XString(this.__toString(), this.__state);
    }
}
_Point_x = new WeakMap(), _Point_y = new WeakMap();
function prettyPrint(value) {
    if (value instanceof XString) {
        if (value.__value.includes("'")) {
            return `"${Chalk.green(value.__value)}"`;
        }
        else {
            return `'${Chalk.green(value.__value)}'`;
        }
    }
    if (value instanceof XInteger || value instanceof XFloat) {
        return Chalk.yellow(value.__toString());
    }
    if (value instanceof XBoolean) {
        return Chalk.magenta(value.__toString());
    }
    if (value instanceof XOptional) {
        if (value.__value === undefined) {
            return value.__toString();
        }
        else {
            return `some(${prettyPrint(value.__value)})`;
        }
    }
    if (value instanceof XArray) {
        return `[${value.__value.map(prettyPrint).join(" ")}]`;
    }
    if (value instanceof XSet) {
        return `$[${Array.from(value.__value.values())
            .map(prettyPrint)
            .join(" ")}]`;
    }
    if (value instanceof XTuple) {
        return `@[${value.__value.map(prettyPrint).join(" ")}]`;
    }
    if (value instanceof XMap) {
        const entries = Array.from(value.__value.entries()).map(([key, val]) => {
            return `${prettyPrint(value.__keys.get(key))}: ${prettyPrint(val)}`;
        });
        return `{${entries.join(", ")}}`;
    }
    if (value instanceof XRecord) {
        const members = Array.from(value.__value.entries())
            .sort(([prop1], [prop2]) => {
            if (prop1 < prop2)
                return -1;
            if (prop1 > prop2)
                return 1;
            return 0;
        })
            .map(([name, val]) => `${name}: ${prettyPrint(val)}`)
            .join(", ");
        return `${value.constructor.name.toLowerCase()} {${members}}`;
    }
    return value.__toString();
}
const rl = ReadLine.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
    prompt: "> ",
    historySize: 1000,
    removeHistoryDuplicates: true,
    tabSize: 2
});
rl.prompt();
let input = "";
rl.on("line", (line) => {
    input += line;
    if (line[line.length - 1] === " ") {
        rl.setPrompt("  ");
        rl.prompt();
        return;
    }
    try {
        const environment = new Map();
        const records = new Map([["point", Point]]);
        const start = process.hrtime.bigint();
        const value = Ecks.render(input, { environment, records });
        const duration = process.hrtime.bigint() - start;
        console.log(`${prettyPrint(value)} :: ${value.kind}`);
        if (process.env.DEBUG === "1") {
            console.log(`Elapsed: ${Number(duration) / 1e6}ms`);
        }
    }
    catch (err) {
        if (!(err instanceof SyntaxError || err instanceof TypeError) &&
            line.length > 0) {
            rl.setPrompt("  ");
            rl.prompt();
            return;
        }
        else if (err instanceof Error) {
            console.log(err);
            console.log(`${err.name}: ${err.message}`);
        }
        else {
            throw new Error("Unexpected Error");
        }
    }
    input = "";
    rl.setPrompt("> ");
    rl.prompt();
});
rl.on("close", () => {
    process.exit(0);
});
//# sourceMappingURL=repl.js.map