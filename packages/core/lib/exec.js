const path = require('path')
const { Package } = require('@hyhan-cli/models')
const { log } = require('@hyhan-cli/utils')
const userHome = require('user-home')
const { CACHE_DIR } = require('./const')

const SETTINGS = {
  // init: '@hyhan-cli/commands',
  init: '@hyhan/emitter',
}
let pkg
async function exec(...args) {
  const cmdObj = args[args.length - 1]
  const cmdName = cmdObj.name()
  let targetPath = process.env.CLI_TARGET_PATH
  let storeDir
  const packageVersion = 'latest'
  const packageName = SETTINGS[cmdName]
  if (!targetPath) {
    targetPath = path.resolve(userHome, process.env.CLI_HOME, CACHE_DIR)
    storeDir = path.resolve(targetPath, 'node_modules')
    log.verbose('userHome', userHome)
    log.verbose('targetPath', targetPath)
    log.verbose('storeDir', storeDir)
    pkg = new Package({
      targetPath,
      storeDir,
      packageVersion,
      packageName,
    })
    if (pkg.exists()) {
      await pkg.update()
    } else {
      await pkg.install()
    }
  } else {
    pkg = new Package({
      targetPath,
      storeDir,
      packageVersion,
      packageName,
    })
  }
  const rootFile = pkg.getFileRoot()
  if (rootFile) {
    const commands = require(rootFile)
    commands.init(...args)
  }
}

module.exports = exec
// /Users/hi/h/hyhan-cli/packages/commands
