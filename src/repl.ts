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

  if (value instanceof XMap) {
    const entries = Array.from(value.__value.entries()).map(([key, val]) => {
      return `${prettyPrint(value.__keys.get(key) as TypedValue)}: ${prettyPrint(val)}`
    })
    return `{${entries.join(', ')}}`
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
    const start = process.hrtime.bigint()
    const value = Ecks.eval(input)
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
