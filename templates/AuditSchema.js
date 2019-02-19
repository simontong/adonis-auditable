'use strict'

const Schema = use('Schema')

class AuditSchema extends Schema {
  up () {
    this.create('audits', (table) => {
      table.increments()
      table.uuid('user_uuid').unsigned().references('uuid').inTable('users')
      table.uuid('auditable_uuid').notNullable().index()
      table.string('auditable').notNullable()
      table.string('event').notNullable()
      table.string('ip', 45).notNullable()
      table.text('url').notNullable()
      table.text('old_data', 'longtext')
      table.text('new_data', 'longtext')
      table.dateTime('created_at')
    })
  }

  down () {
    this.drop('audits')
  }
}

module.exports = AuditSchema
