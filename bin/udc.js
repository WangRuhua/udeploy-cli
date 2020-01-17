#!/usr/bin/env node

const argv = require('yargs')
  .version('1.0.0')
  .usage('Usage: $0 snapshot|deploy|app [options]')
  .command(['snapshot'], 'command for snapshot ',{}, require('../lib/snapshot'))
  .command(['deploy'], 'command for deploy', {},require('../lib/deploy'))
  .command(['app'], 'command for deploy', {},require('../lib/application'))
  .command(['test'], 'command for deploy', {},require('../lib/test'))
  .demandCommand(1,1,'You need one command before moving on: snapshot|deploy|app')
  .count('verbose')
  .alias('v','verbose')
  .help('h')
  .alias('h', 'help')
  .argv;