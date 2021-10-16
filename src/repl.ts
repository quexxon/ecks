import * as ReadLine from 'readline'
import * as Chalk from 'chalk'

import Interpreter from './interpreter'
import Parser from './parser'
import Scanner from './scanner'
import XString from './std/string'
import XInteger from './std/integer'
import XFloat from './std/float'
import XBoolean from './std/boolean'
import { TypedValue } from './ast'
import XOptional from './std/optional'
import XArray from './std/array'
import XSet from './std/set'
import XMap from './std/map'

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
      const scanner = new Scanner(key)
      const parser = new Parser(scanner.scan())
      const interpreter = new Interpreter(parser.parse())

      return `${prettyPrint(interpreter.eval())}: ${prettyPrint(val)}`
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
    const scanner = new Scanner(input)
    const parser = new Parser(scanner.scan())
    const interpreter = new Interpreter(parser.parse())
    const value = interpreter.eval()
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
