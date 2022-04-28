const { Package } = require('@hyhan-cli/models')
const { log } = require('@hyhan-cli/utils')

function exec() {
  const targetPath = process.env.CLI_TARGET_PATH
  const homePath = process.env.CLI_HOME
  log.verbose('targetPath', targetPath)
  log.verbose('homePath', homePath)
  const pkg = new Package({ targetPath, storePath: homePath })
  console.log(pkg)
  console.log(process.env.CLI_TARGET_PATH)
}

module.exports = exec
