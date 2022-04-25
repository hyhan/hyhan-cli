const axios = require('axios')
const urlJoin = require('url-join')
const semver = require('semver')

function getNpmInfo(npmName, registry = 'https://registry.npmjs.org') {
  if (!npmName) {
    return null
  }
  const npmInfoUrl = urlJoin(registry, npmName)
  return axios.get(npmInfoUrl).then((res) => {
    if (res.status === 200) {
      return res.data
    } else {
      return null
    }
  })
}

async function getNpmVersions(npmName, registry) {
  const data = await getNpmInfo(npmName, registry)
  return Object.keys(data.versions)
}

function getNpmSemverVersions(baseVersion, versions) {
  return versions
    .filter((version) => semver.satisfies(version, `^${baseVersion}`))
    .sort((a, b) => semver.gt(a, b))
}

async function getNpmSemverVersion(baseVersion, npmName, registry) {
  const versions = await getNpmVersions(npmName, registry)
  const newVersions = getNpmSemverVersions(baseVersion, versions)
  if (newVersions && newVersions.length > 0) {
    return newVersions[0]
  }
}

module.exports = {
  getNpmInfo,
  getNpmVersions,
  getNpmSemverVersion,
}
