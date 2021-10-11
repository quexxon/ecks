import * as readline from 'readline'
// import { inspect } from 'util'
import Interpreter from './interpreter'

import Parser from './parser'
import Scanner from './scanner'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
})

rl.prompt()

rl.on('line', (line) => {
  const start = process.hrtime.bigint()
  const scanner = new Scanner(line)
  const parser = new Parser(scanner.scan())
  const interpreter = new Interpreter(parser.parse())
  const value = interpreter.eval()
  const duration = process.hrtime.bigint() - start

  console.log(`Elapsed: ${Number(duration) / 1e6}ms`)
  console.log(value.__toString(), `(${value.kind})`)

  rl.prompt()
}).on('close', () => {
  process.exit(0)
})
