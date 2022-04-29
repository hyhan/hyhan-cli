const npmlog = require('npmlog')

npmlog.addLevel('success', 2000, { bg: 'green' })
npmlog.level = process.env.LOG_LEVEL || 'info'
npmlog.heading = 'hyhan'
npmlog.headingStyle = { fg: 'blue', bg: 'white' }

module.exports = npmlog
