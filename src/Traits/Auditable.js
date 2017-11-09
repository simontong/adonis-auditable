'use strict'

const _ = require('lodash')
const Audit = use('App/Models/Audit')

class Auditable {
  constructor () {
    this._oldData = {}
  }

  register (Model) {
    // Model.addHook('beforeUpdate', this._beforeUpdate.bind(this))
    // Model.addHook('afterUpdate', this._afterUpdate.bind(this))
    // Model.addHook('afterCreate', this._afterCreate.bind(this))
    // Model.addHook('afterDelete', this._afterDelete.bind(this))
  }

  async _afterCreate (model) {
    const event = Audit.EVENT_CREATE
    const newModel = (await this.find(model.primaryKeyValue))
    const auditable = newModel.constructor.name
    const auditableId = newModel.id
    const newData = newModel.$attributes

    // save audit
    await this._createAudit(event, auditable, auditableId, null, newData)
  }

  _beforeUpdate (model) {
    this._oldData[model] = model.$originalAttributes
  }

  async _afterUpdate (model) {
    const event = this.ctx.request.method() === 'PATCH' ? Audit.EVENT_PATCH : Audit.EVENT_UPDATE
    const auditable = model.constructor.name
    const auditableId = model.id
    const oldData = this._oldData[model]
    const newModel = (await this.constructor.find(model.primaryKeyValue))
    const newData = newModel.$attributes

    // if new and old are equal then don't bother updating
    // todo: do this
    const ignoreDiff = ['updated_at']

    const isEqual = _.isEqual(
      _.omit(newData, ignoreDiff),
      _.omit(oldData, ignoreDiff)
    )
    if (isEqual) {
      return
    }

    // save audit
    await this._createAudit(event, auditable, auditableId, oldData, newData)
  }

  async _afterDelete (model) {
    const event = Audit.EVENT_DELETE
    const auditable = model.constructor.name
    const auditableId = model.id
    const oldData = model.$originalAttributes

    // save audit
    await this._createAudit(event, auditable, auditableId, oldData)
  }

  async _createAudit (event, auditable, auditableId, oldData, newData) {
    // get user data to store
    const userId = _.get(this.ctx, 'auth.user.id', null)
    const url = this.ctx.request.absoluteUrl()
    const ip = this.ctx.request.ip()

    // save audit
    await Audit.create({
      user_id: userId,
      auditable_id: auditableId,
      auditable,
      event,
      url,
      ip,
      old_data: oldData,
      new_data: newData,
    })
  }
}

module.exports = Auditable
