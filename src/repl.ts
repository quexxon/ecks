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

function prettyPrint (value: TypedValue): string {
  const val = value instanceof XOptional && value.__value !== undefined ? value.__value : value
  let str: string = val.__toString()
  if (val instanceof XString) {
    if (val.__value.includes("'")) {
      str = `"${Chalk.green(val.__value)}"`
    } else {
      str = `'${Chalk.green(val.__value)}'`
    }
  } else if (val instanceof XInteger || val instanceof XFloat) {
    str = Chalk.yellow(str)
  } else if (val instanceof XBoolean) {
    str = Chalk.magenta(str)
  }

  if (value instanceof XOptional && value.__value !== undefined) {
    str = `some(${str})`
  }

  return str
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
