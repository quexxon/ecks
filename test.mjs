import * as Ecks from './src/index.js';

const state = {
  environment: new Map(),
  records: new Map(),
}

state.environment.set('$one', Ecks.fromJs(1))

const value = Ecks.eval('$one + 2', state)
console.log(Ecks.toJs(value)) // logs: 3
