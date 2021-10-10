function safeEval(expression, environment) {
  return Function(`
    "use strict";
    const {${Object.keys(environment).join(', ')}} = arguments[0];
    return (${expression});
  `)(environment)
}

class Type {
  static #isString(value, options) {
    return (
      typeof value === 'string'
      && ('min' in options ? value.length >= options.min : true)
      && ('max' in options ? value.length <= options.max : true)
    )
  }

  static #isNumber(value, options) {
    return (
      typeof value === 'number'
      && ('min' in options ? value >= options.min : true)
      && ('max' in options ? value <= options.max : true)
    )
  }

  static #isArray(value, options) {
    return (
      Array.isArray(value)
      && ('min' in options ? value.length >= options.min : true)
      && ('max' in options ? value.length <= options.max : true)
      && value.every(entry => this.isInstance(entry, options.of))
    )
  }

  static isInstance(value, { kind, ...options }) {
    switch (kind) {
      case 'string': return this.#isString(value, options)
      case 'number': return this.#isNumber(value, options)
      case 'array': return this.#isArray(value, options)
      default: throw new Error(`Unknown kind: ${kind}`)
    }
  }
}

class Metadata {
  static evaluate(data, schema, metadata) {
    // TODO: Validate schema for real
    if (data.namespace !== schema.namespace) {
      throw new Error('Incorrect schema')
    }

    const result = {
      namespace: data.namespace,
      fields: {}
    }

    for (const [field, type] of Object.entries(schema.fields)) {
      let { kind, value } = data.fields[field]
      if (value === undefined || value === null) {
        throw new Error(`Unsupported nil value`)
      }

      const evaluated = kind === 'expression' ? safeEval(value, metadata) : value
      if (!Type.isInstance(evaluated, type)) {
        throw new Error(`TypeError: Expected ${type.kind}, got ${evaluated}`)
      }

      result.fields[field] = evaluated
    }

    return result
  }
}

const userSchema = {
  namespace: 'user',
  fields: {
    id: {
      kind: 'string',
      min: 36,
      max: 36
    },
    name: {
      kind: 'string',
      min: 1,
      max: 100
    },
    age: {
      kind: 'number',
      min: 18,
      max: 130
    },
    roles: {
      kind: 'array',
      of: { kind: 'string', min: 1 }
    }
  }
}

const nodeSchema = {
  namespace: 'example',
  fields: {
    instanceId: {
      kind: 'number'
    },
    owner: {
      kind: 'string',
      min: 1,
      max: 100
    },
    roleSummary: {
      kind: 'string'
    }
  }
}

const userData = {
  namespace: 'user',
  fields: {
    id: 'e4a47036-ccfb-4488-aeca-35c2f4e9ce3f',
    name: 'Will Clardy',
    age: 33,
    roles: ['developer', 'reporter', 'admin']
  }
}

// A form in the UI would yield a representation in this (potentially)
// unevaluated intermediate form.
const intermediateForm = {
  namespace: 'example',
  fields: {
    instanceId: {
      kind: 'value',
      value: 1234
    }, // value - doesn't require evaluation
    owner: {
      kind: 'expression',
      value: '`${user.name.trim().toUpperCase()} (${user.id})`'
    }, // unevaluated expression
    roleSummary: {
      kind: 'expression',
      value: 'user.roles.sort().map(s => s.toUpperCase()).join(", ")'
    } // unevaluated expression
  }
}

const environment = { user: userData.fields }
const nodeMetadata = Metadata.evaluate(intermediateForm, nodeSchema, environment)
console.log(nodeMetadata)
