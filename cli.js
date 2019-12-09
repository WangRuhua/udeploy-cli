#!/usr/bin/env node

const argv = require('yargs')
  .version('sss')
  .usage('Usage: $0 snapshot|deploy|app [options]')
  .command(['snapshot'], 'command for snapshot ',{}, require('./lib/snapshot'))
  .command(['deploy'], 'command for deploy', {},require('./lib/deploy'))
  .command(['app'], 'command for deploy', {},require('./lib/application'))
  .demandCommand(1, 'You need at least one command before moving on')
  .help('h')
  .alias('h', 'help')
  .argv;