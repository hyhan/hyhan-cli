#! /usr/bin/env node
const importLocal = require('import-local')
const npmlog = require('npmlog')

if (importLocal(__filename)) {
  npmlog.info('cli', '正处使用cli 本地版本')
} else {
  require('../lib')(process.argv.slice(2))
}
