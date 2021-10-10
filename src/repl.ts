import * as readline from 'readline'
import { inspect } from 'util'

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
  const ast = parser.parse()
  const duration = process.hrtime.bigint() - start

  console.log(`Scanned and parsed in ${Number(duration) / 1e6}ms`)
  console.log('AST:', inspect(ast, false, 100, true))

  rl.prompt()
}).on('close', () => {
  process.exit(0)
})
