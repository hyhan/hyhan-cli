class Package {
  constructor(options) {
    console.log('Package constructor')
    // package 路径
    this.targetPath = options.targetPath
    // package 缓存路径
    this.storePath = options.storePath
    // package name
    this.packageName = options.packageName
    // package version
    this.packageVersion = options.packageVersion
  }

  // 判断当前package是否存在
  exists() {}

  install() {}

  update() {}
}

module.exports = Package
