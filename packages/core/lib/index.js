'use strict'

const fs = require('fs')
const path = require('path')
const semver = require('semver')
const rootCheck = require('root-check')
const userHome = require('user-home')
const colors = require('colors/safe')
const dotenv = require('dotenv')
const commander = require('commander')
const { log, getNpmSemverVersion } = require('@hyhan-cli/utils')
// const { init } = require('@hyhan-cli/commands')
const pkg = require('../package.json')
const {
  LOWEST_NODE_VERSION,
  DEFAULT_CLI_HOME,
  DEFAULT_CONFIG_FILENAME,
} = require('./const')
const exec = require('./exec')

const program = new commander.Command()

let config

async function cli() {
  try {
    await prepare()
    await registerCommand()
  } catch (error) {
    log.error(error.message)
  }
}

async function prepare() {
  checkPkgVersion()
  checkNodeVersion()
  checkRoot()
  checkUserHome()
  checkEnv()
  await checkGlobalUpdate()
}

async function registerCommand() {
  program
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d, --debug', '是否开启调试模式', false)
    .option('-tp, --targetPath <targetPath>', '是否指定本地调试文件路径', '')

  program
    .command('init [projectName]')
    .option('-f, --force', '是否强制初始化项目')
    .action(exec)

  program.on('option:debug', function () {
    const opts = program.opts()
    if (opts.debug) {
      process.env.LOG_LEVEL = 'verbose'
    } else {
      process.env.LOG_LEVEL = 'info'
    }
    log.level = process.env.LOG_LEVEL
  })

  program.on('option:targetPath', function (targetPath) {
    if (targetPath) {
      process.env.CLI_TARGET_PATH = targetPath
    }
  })

  program.on('command:*', function (obj) {
    const availableCommands = program.commands.map((cmd) => cmd.name())
    console.log(colors.red(`未知的命令：${obj[0]}`))
    if (availableCommands.length > 0) {
      console.log(colors.red(`可用命令：${availableCommands.join(',')}`))
    }
  })

  program.parse(process.argv)
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

function checkEnv() {
  const dotenvPath = path.resolve(userHome, DEFAULT_CONFIG_FILENAME)
  if (fs.existsSync(dotenvPath)) {
    dotenv.config({
      path: dotenvPath,
    })
  }
  config = createDefaultConfig()
  console.log(config)
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
