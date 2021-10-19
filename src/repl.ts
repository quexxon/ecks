import * as ReadLine from 'readline'
import * as Chalk from 'chalk'

import { TypedValue } from './ast'
import Ecks from '.'
import XArray from './std/array'
import XBoolean from './std/boolean'
import XFloat from './std/float'
import XInteger from './std/integer'
import XMap from './std/map'
import XOptional from './std/optional'
import XSet from './std/set'
import XString from './std/string'
import XRecord from './std/record'
import { Environment, Records, State } from './types'
import XTuple from './std/tuple'

// Example record
class Point extends XRecord {
  #x: XInteger | XFloat
  #y: XInteger | XFloat

  constructor (value: Map<string, TypedValue>, state: State) {
    super(value, state)

    const x = value.get('x')
    if (x === undefined || !(x instanceof XInteger || x instanceof XFloat)) {
      throw new TypeError()
    }

    const y = value.get('y')
    if (y === undefined || !(y instanceof XInteger || y instanceof XFloat)) {
      throw new TypeError()
    }

    if (value.size > 2) throw new TypeError()

    if (x.kind !== y.kind) throw new TypeError()

    this.#x = x
    this.#y = y
  }

  __new (value: Map<string, TypedValue>): Point {
    return new Point(value, this.__state)
  }

  x (): XInteger | XFloat { return this.#x }
  y (): XInteger | XFloat { return this.#y }

  str (): XString {
    return new XString(this.__toString(), this.__state)
  }
}

function prettyPrint (value: TypedValue): string {
  if (value instanceof XString) {
    if (value.__value.includes("'")) {
      return `"${Chalk.green(value.__value)}"`
    } else {
      return `'${Chalk.green(value.__value)}'`
    }
  }

  if (value instanceof XInteger || value instanceof XFloat) {
    return Chalk.yellow(value.__toString())
  }

  if (value instanceof XBoolean) {
    return Chalk.magenta(value.__toString())
  }

  if (value instanceof XOptional) {
    if (value.__value === undefined) {
      return value.__toString()
    } else {
      return `some(${prettyPrint(value.__value)})`
    }
  }

  if (value instanceof XArray) {
    return `[${value.__value.map(prettyPrint).join(' ')}]`
  }

  if (value instanceof XSet) {
    return `$[${Array.from(value.__value.values()).map(prettyPrint).join(' ')}]`
  }

  if (value instanceof XTuple) {
    return `@[${value.__value.map(prettyPrint).join(' ')}]`
  }

  if (value instanceof XMap) {
    const entries = Array.from(value.__value.entries()).map(([key, val]) => {
      return `${prettyPrint(value.__keys.get(key) as TypedValue)}: ${prettyPrint(val)}`
    })
    return `{${entries.join(', ')}}`
  }

  if (value instanceof XRecord) {
    const members = Array.from(value.__value.entries()).map(([name, val]) => {
      return `${name}: ${prettyPrint(val)}`
    })
    return `${(value as object).constructor.name.toLowerCase()} {${members.join(', ')}}`
  }

  return value.__toString()
}

const rl = ReadLine.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
  prompt: '> ',
  historySize: 1000,
  removeHistoryDuplicates: true,
  tabSize: 2
})

rl.prompt()

let input = ''

rl.on('line', (line) => {
  input += line

  if (line[line.length - 1] === ' ') {
    rl.setPrompt('  ')
    rl.prompt()
    return
  }

  try {
    const environment: Environment = new Map()
    const records: Records = new Map([['point', Point]])
    const start = process.hrtime.bigint()
    const value = Ecks.eval(input, { environment, records })
    const duration = process.hrtime.bigint() - start

    console.log(`${prettyPrint(value)} :: ${value.kind}`)
    if (process.env.DEBUG === '1') {
      console.log(`Elapsed: ${Number(duration) / 1e6}ms`)
    }
  } catch (err) {
    if (!(err instanceof SyntaxError || err instanceof TypeError) && line.length > 0) {
      rl.setPrompt('  ')
      rl.prompt()
      return
    } else if (err instanceof Error) {
      console.log(err)
      console.log(`${err.name}: ${err.message}`)
    } else {
      throw new Error('Unexpected Error')
    }
  }

  input = ''
  rl.setPrompt('> ')
  rl.prompt()
})

rl.on('close', () => {
  process.exit(0)
})
