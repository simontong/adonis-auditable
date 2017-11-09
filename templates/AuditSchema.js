'use strict'

const Schema = use('Schema')

class AuditSchema extends Schema {
  up () {
    this.create('audits', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('auditable_id').notNullable().index()
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
