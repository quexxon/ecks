import * as ReadLine from 'readline'
import * as Chalk from 'chalk'
// import { inspect } from 'util'
import Interpreter from './interpreter'

import Parser from './parser'
import Scanner from './scanner'
import XString from './std/string'
import XInteger from './std/integer'
import XFloat from './std/float'
import XBoolean from './std/boolean'

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
    rl.setPrompt('| ')
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

    let printValue: string = value.__toString()
    if (value instanceof XString) {
      if (value.__value.includes("'")) {
        printValue = `"${Chalk.green(value.__value)}"`
      } else {
        printValue = `'${Chalk.green(value.__value)}'`
      }
    } else if (value instanceof XInteger || value instanceof XFloat) {
      printValue = Chalk.yellow(printValue)
    } else if (value instanceof XBoolean) {
      printValue = Chalk.magenta(printValue)
    }

    console.log(`${printValue} (${value.kind})`)
    if (process.env.DEBUG === '1') {
      console.log(`Elapsed: ${Number(duration) / 1e6}ms`)
    }
  } catch (err) {
    if (!(err instanceof SyntaxError || err instanceof TypeError) && line.length > 0) {
      rl.setPrompt('| ')
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
