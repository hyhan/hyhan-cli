'use strict'

const fs = require('fs')
const semver = require('semver')
const rootCheck = require('root-check')
const userHome = require('user-home')
const colors = require('colors/safe')
const minimist = require('minimist')
const { log } = require('@hyhan-cli/utils')
const pkg = require('../package.json')
const { LOWEST_NODE_VERSION } = require('./const')

let args

function cli() {
  try {
    checkPkgVersion()
    checkNodeVersion()
    checkRoot()
    checkUserHome()
    checkInputArgs()
    checkArgs()
    log.verbose('debug', 'test debug test')
  } catch (error) {
    log.error(error.message)
  }
}

function checkPkgVersion() {
  log.notice(`当前 CLI 版本：${pkg.version}`)
}

function checkNodeVersion() {
  const currentVersion = process.version
  const lowstVersion = LOWEST_NODE_VERSION
  if (!semver.gte(currentVersion, lowstVersion)) {
    throw new Error(
      colors.red(`hyhan-cli 需要安装 ${lowstVersion} 以上版本的 Node.js`)
    )
  }
}

function checkRoot() {
  rootCheck()
}

function checkUserHome() {
  if (!userHome || !fs.existsSync(userHome)) {
    throw new Error(colors.red('当前登录用户主目录不存在！'))
  }
}

function checkInputArgs() {
  args = minimist(process.argv.slice(2))
}

function checkArgs() {
  if (args.debug) {
    process.env.LOG_LEVEL = 'verbose'
  } else {
    process.env.LOG_LEVEL = 'info'
  }
  log.level = process.env.LOG_LEVEL
}

module.exports = cli
