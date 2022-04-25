'use strict'

const fs = require('fs')
const path = require('path')
const semver = require('semver')
const rootCheck = require('root-check')
const userHome = require('user-home')
const colors = require('colors/safe')
const minimist = require('minimist')
const dotenv = require('dotenv')
const { log, getNpmSemverVersion } = require('@hyhan-cli/utils')
const pkg = require('../package.json')
const {
  LOWEST_NODE_VERSION,
  DEFAULT_CLI_HOME,
  DEFAULT_CONFIG_FILENAME,
} = require('./const')

let args, config

function cli() {
  try {
    checkPkgVersion()
    checkNodeVersion()
    checkRoot()
    checkUserHome()
    checkInputArgs()
    checkArgs()
    checkEnv()
    checkGlobalUpdate()
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

function checkEnv() {
  const dotenvPath = path.resolve(userHome, DEFAULT_CONFIG_FILENAME)
  if (fs.existsSync(dotenvPath)) {
    dotenv.config({
      path: dotenvPath,
    })
  }
  config = createDefaultConfig()
  log.verbose('环境变量', config)
}

function createDefaultConfig() {
  const cliConfig = {
    home: userHome,
  }
  if (process.env.CLI_HOME) {
    cliConfig.cliHome = path.join(userHome, process.env.CLI_HOME)
  } else {
    cliConfig.cliHome = path.join(userHome, DEFAULT_CLI_HOME)
  }
  return cliConfig
}

async function checkGlobalUpdate() {
  // https://registry.npmjs.org/@hyhan-cli/core
  const { version: currentVersion, name: npmName } = pkg
  const lastVersion = await getNpmSemverVersion(currentVersion, npmName)
  if (semver.gt(lastVersion, currentVersion)) {
    log.warn(
      '更新提示',
      colors.yellow(`当前版本为${currentVersion}，最新版本为${lastVersion}`)
    )
  }
}

module.exports = cli
