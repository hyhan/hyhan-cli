const path = require('path')
const pkgDir = require('pkg-dir').sync
const npminstall = require('npminstall')
const { formatPath } = require('@hyhan-cli/utils')

class Package {
  constructor(options) {
    console.log('Package constructor', options)
    // package 路径
    this.targetPath = options.targetPath
    // package 缓存路径
    this.storeDir = options.storeDir
    // package name
    this.packageName = options.packageName
    // package version
    this.packageVersion = options.packageVersion
  }

  // 判断当前package是否存在
  exists() {}

  // 安装依赖
  async install() {
    await npminstall({
      root: this.targetPath,
      storeDir: this.storeDir,
      registry: 'https://registry.npmjs.org',
      pkgs: [
        {
          name: this.packageName,
          version: this.packageVersion,
        },
      ],
    })
  }

  async update() {}

  getFileRoot() {
    // 1. 获取package.json所在目录
    // 2. 读取package.json
    // 3. 寻找入口文件
    // 4. 兼容（windows/mac）
    const dir = pkgDir(this.targetPath)
    if (dir) {
      const pkgFile = require(path.resolve(dir, 'package.json'))
      if (pkgFile && pkgFile.main) {
        return formatPath(path.resolve(dir, pkgFile.main))
      }
    }
    return null
  }
}

module.exports = Package
