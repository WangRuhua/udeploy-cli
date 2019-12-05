#!/usr/bin/env node

const open = require('open');

const argv = require('yargs')
  .version('sss')
  .usage('Usage: udeploy-cli snapshot|deploy [options]')
  .command(['snapshot'], 'command for snapshot ', require('./lib/snapshot'))
  .demandCommand(1, 'You need at least one command before moving on')
  .help('h')
  .alias('h', 'help')
  .argv;