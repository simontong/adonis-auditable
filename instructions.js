'use strict'

const path = require('path')

async function copyAuditMigration (cli) {
  try {
    const migrationsFile = cli.helpers.migrationsPath(`${new Date().getTime()}_audit.js`)
    await cli.copy(
      path.join(__dirname, 'templates', 'AuditSchema.js'),
      path.join(migrationsFile)
    )
    cli.command.completed('create', migrationsFile.replace(cli.helpers.appRoot(), '').replace(path.sep, ''))
  }
  catch (error) {
    console.log(error)
  }
}

async function copyAuditModel (cli) {
  try {
    await cli.copy(
      path.join(__dirname, 'templates', 'Audit.js'),
      path.join(cli.appDir, 'Models/Audit.js')
    )
    cli.command.completed('create', 'Models/Audit.js')
  }
  catch (error) {
    console.log(error)
  }
}

module.exports = async (cli) => {
  await copyAuditModel(cli)
  await copyAuditMigration(cli)
}
