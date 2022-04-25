'use strict'
const { log } = require('./log.js')
const {
  getNpmInfo,
  getNpmVersions,
  getNpmSemverVersion,
} = require('./get-npm-info.js')

module.exports = {
  log,
  getNpmInfo,
  getNpmVersions,
  getNpmSemverVersion,
}
