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
var _Interpreter_instances, _Interpreter_expression, _Interpreter_state, _Interpreter_evaluate, _Interpreter_primitive, _Interpreter_grouping, _Interpreter_unary, _Interpreter_binary, _Interpreter_ternary, _Interpreter_cond, _Interpreter_case, _Interpreter_let, _Interpreter_array, _Interpreter_set, _Interpreter_tuple, _Interpreter_map, _Interpreter_record, _Interpreter_methodCall, _Interpreter_index, _Interpreter_lambda, _Interpreter_optional, _Interpreter_identifier;
import { UnaryOperator } from "./ast.js";
import XArray from "./std/array.js";
import XBoolean from "./std/boolean.js";
import XLambda from "./std/lambda.js";
import XMap from "./std/map.js";
import XOptional from "./std/optional.js";
import XSet from "./std/set.js";
import XRecord from "./std/record.js";
import XString from "./std/string.js";
import XTemplateString from "./std/templateString.js";
import XTuple from "./std/tuple.js";
export default class Interpreter {
    constructor(expression, state) {
        _Interpreter_instances.add(this);
        _Interpreter_expression.set(this, void 0);
        _Interpreter_state.set(this, void 0);
        __classPrivateFieldSet(this, _Interpreter_expression, expression, "f");
        __classPrivateFieldSet(this, _Interpreter_state, state, "f");
    }
    render() {
        return __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_evaluate).call(this, __classPrivateFieldGet(this, _Interpreter_expression, "f"));
    }
}
_Interpreter_expression = new WeakMap(), _Interpreter_state = new WeakMap(), _Interpreter_instances = new WeakSet(), _Interpreter_evaluate = function _Interpreter_evaluate(expression) {
    switch (expression.kind) {
        case "primitive":
            return __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_primitive).call(this, expression);
        case "grouping":
            return __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_grouping).call(this, expression);
        case "unary":
            return __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_unary).call(this, expression);
        case "binary":
            return __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_binary).call(this, expression);
        case "ternary":
            return __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_ternary).call(this, expression);
        case "cond":
            return __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_cond).call(this, expression);
        case "case":
            return __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_case).call(this, expression);
        case "let":
            return __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_let).call(this, expression);
        case "array":
            return __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_array).call(this, expression);
        case "set":
            return __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_set).call(this, expression);
        case "tuple":
            return __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_tuple).call(this, expression);
        case "map":
            return __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_map).call(this, expression);
        case "record":
            return __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_record).call(this, expression);
        case "method-call":
            return __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_methodCall).call(this, expression);
        case "index":
            return __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_index).call(this, expression);
        case "lambda":
            return __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_lambda).call(this, expression);
        case "optional":
            return __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_optional).call(this, expression);
        case "identifier":
            return __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_identifier).call(this, expression);
    }
}, _Interpreter_primitive = function _Interpreter_primitive(primitive) {
    return primitive.value instanceof XTemplateString
        ? primitive.value.evaluate(__classPrivateFieldGet(this, _Interpreter_state, "f"))
        : primitive.value;
}, _Interpreter_grouping = function _Interpreter_grouping(grouping) {
    return __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_evaluate).call(this, grouping.expression);
}, _Interpreter_unary = function _Interpreter_unary(unary) {
    const operand = __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_evaluate).call(this, unary.operand);
    if (unary.operator === UnaryOperator.Negation) {
        if (Symbol.for("neg") in operand) {
            return operand[Symbol.for("neg")]();
        }
    }
    if (Symbol.for(unary.operator) in operand) {
        return operand[Symbol.for(unary.operator)]();
    }
    throw new TypeError();
}, _Interpreter_binary = function _Interpreter_binary(binary) {
    const l = __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_evaluate).call(this, binary.left);
    const r = __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_evaluate).call(this, binary.right);
    if (Symbol.for(binary.operator) in l) {
        return l[Symbol.for(binary.operator)](r);
    }
    throw new TypeError();
}, _Interpreter_ternary = function _Interpreter_ternary(ternary) {
    const condition = __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_evaluate).call(this, ternary.antecedent);
    if (!(condition instanceof XBoolean)) {
        throw new TypeError();
    }
    if (condition.__value) {
        return __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_evaluate).call(this, ternary.consequent);
    }
    else {
        return __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_evaluate).call(this, ternary.alternative);
    }
}, _Interpreter_cond = function _Interpreter_cond(cond) {
    let result;
    for (const [antecedent, consequent] of cond.branches) {
        const condition = __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_evaluate).call(this, antecedent);
        if (!(condition instanceof XBoolean)) {
            throw new TypeError();
        }
        if (condition.__value) {
            result = __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_evaluate).call(this, consequent);
            break;
        }
    }
    if (cond.else === undefined) {
        return new XOptional(__classPrivateFieldGet(this, _Interpreter_state, "f"), result);
    }
    if (result === undefined) {
        result = __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_evaluate).call(this, cond.else);
    }
    return result;
}, _Interpreter_case = function _Interpreter_case(case_) {
    const target = __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_evaluate).call(this, case_.target);
    if (target instanceof XLambda || target instanceof XOptional) {
        throw new TypeError();
    }
    let result;
    for (const [caseValue, expression] of case_.branches) {
        const case_ = __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_evaluate).call(this, caseValue);
        if (case_ instanceof XLambda || case_ instanceof XOptional) {
            throw new TypeError();
        }
        if (case_.kind !== target.kind) {
            throw new TypeError();
        }
        if (case_.__value === target.__value) {
            result = __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_evaluate).call(this, expression);
        }
    }
    if (case_.else === undefined) {
        return new XOptional(__classPrivateFieldGet(this, _Interpreter_state, "f"), result);
    }
    if (result === undefined) {
        result = __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_evaluate).call(this, case_.else);
    }
    return result;
}, _Interpreter_let = function _Interpreter_let(let_) {
    const state = {
        environment: new Map(__classPrivateFieldGet(this, _Interpreter_state, "f").environment),
        records: new Map(__classPrivateFieldGet(this, _Interpreter_state, "f").records)
    };
    for (const [name, expression] of let_.bindings) {
        const interpreter = new Interpreter(expression, state);
        const value = interpreter.render();
        state.environment.set(name.name, value);
    }
    const interpreter = new Interpreter(let_.body, state);
    return interpreter.render();
}, _Interpreter_array = function _Interpreter_array(array) {
    return new XArray(array.elements.map((e) => __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_evaluate).call(this, e)), __classPrivateFieldGet(this, _Interpreter_state, "f"));
}, _Interpreter_set = function _Interpreter_set(set) {
    return new XSet(set.elements.map((e) => __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_evaluate).call(this, e)), __classPrivateFieldGet(this, _Interpreter_state, "f"));
}, _Interpreter_tuple = function _Interpreter_tuple(tuple) {
    return new XTuple(tuple.elements.map((e) => __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_evaluate).call(this, e)), __classPrivateFieldGet(this, _Interpreter_state, "f"));
}, _Interpreter_map = function _Interpreter_map(map) {
    return new XMap(map.elements.map(([k, v]) => [
        __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_evaluate).call(this, k),
        __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_evaluate).call(this, v)
    ]), __classPrivateFieldGet(this, _Interpreter_state, "f"));
}, _Interpreter_record = function _Interpreter_record(record) {
    const RecordType = __classPrivateFieldGet(this, _Interpreter_state, "f").records.get(record.name);
    if (RecordType === undefined) {
        throw new TypeError(`No registered record named '${record.name}'`);
    }
    return new RecordType(record.members.reduce((members, [id, expr]) => {
        members.set(id.name, __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_evaluate).call(this, expr));
        return members;
    }, new Map()), __classPrivateFieldGet(this, _Interpreter_state, "f"));
}, _Interpreter_methodCall = function _Interpreter_methodCall(methodCall) {
    const receiver = __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_evaluate).call(this, methodCall.receiver);
    const identifier = methodCall.identifier.name.toLowerCase();
    const method = receiver[identifier]; // eslint-disable-line @typescript-eslint/no-explicit-any
    if (typeof method === "undefined") {
        throw new TypeError(`No method "${identifier}" for ${receiver.kind}`);
    }
    if (typeof method === "function") {
        return method.apply(receiver, methodCall.arguments.map((exp) => __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_evaluate).call(this, exp)));
    }
    return method;
}, _Interpreter_index = function _Interpreter_index(index) {
    const receiver = __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_evaluate).call(this, index.receiver);
    if (receiver instanceof XArray) {
        return receiver.at(__classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_evaluate).call(this, index.index));
    }
    if (receiver instanceof XString) {
        return receiver.at(__classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_evaluate).call(this, index.index));
    }
    if (receiver instanceof XMap || receiver instanceof XRecord) {
        const indexResult = __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_evaluate).call(this, index.index);
        return receiver.get(indexResult);
    }
    if (receiver instanceof XTuple) {
        return receiver.at(__classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_evaluate).call(this, index.index));
    }
    throw new TypeError(`Index expressions are not supported for ${receiver.kind}`);
}, _Interpreter_lambda = function _Interpreter_lambda(lambda) {
    return new XLambda({
        params: lambda.parameters,
        body: lambda.body
    }, __classPrivateFieldGet(this, _Interpreter_state, "f"));
}, _Interpreter_optional = function _Interpreter_optional(optional) {
    const value = optional.value === undefined
        ? undefined
        : __classPrivateFieldGet(this, _Interpreter_instances, "m", _Interpreter_evaluate).call(this, optional.value);
    return new XOptional(__classPrivateFieldGet(this, _Interpreter_state, "f"), value);
}, _Interpreter_identifier = function _Interpreter_identifier(identifier) {
    const value = __classPrivateFieldGet(this, _Interpreter_state, "f").environment.get(identifier.name);
    if (typeof value === "undefined") {
        throw new TypeError(`Unrecognized identifier: ${identifier.name}`);
    }
    return value;
};
//# sourceMappingURL=interpreter.js.map