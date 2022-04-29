function formatPath(path) {
  if (path) {
    const sep = path.sep
    if (sep === '/') {
      return path
    } else {
      return path.replace(/\\/g, '/')
    }
  }
  return path
}

module.exports = formatPath
