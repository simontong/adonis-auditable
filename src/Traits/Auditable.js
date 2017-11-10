'use strict'

const _ = require('lodash')
const Audit = use('App/Models/Audit')

class Auditable {
  register (Model) {
    Model.createWithAudit = createWithAudit(this.ctx)
    Model.prototype.updateWithAudit = updateWithAudit(this.ctx)
    Model.prototype.deleteWithAudit = deleteWithAudit(this.ctx)
  }
}

/**
 * Create with audit
 *
 * @param auth
 * @param request
 * @returns {*}
 */
function createWithAudit ({request, auth}) {
  return async function (data) {
    const result = await this.create(data)
    const newModel = (await this.find(result.primaryKeyValue))
    const auditable = newModel.constructor.name
    const auditableId = newModel.id
    const newData = newModel.$attributes

    // save audit
    await createAudit(Audit.events.CREATE, {request, auth}, auditable, auditableId, null, newData)

    return result
  }
}

/**
 * Update with audit
 *
 * @param auth
 * @param request
 * @returns {*}
 */
function updateWithAudit ({request, auth}) {
  return async function (data, ignoreDiff = ['updated_at']) {
    const auditable = this.constructor.name
    const auditableId = this.id
    const oldData = this.$originalAttributes
    this.merge(data)
    const result = await this.save()
    const newModel = (await this.constructor.find(this.primaryKeyValue))
    const newData = newModel.$attributes

    // if new and old are equal then don't bother updating
    const isEqual = _.isEqual(
      _.omit(newData, ignoreDiff),
      _.omit(oldData, ignoreDiff)
    )
    if (isEqual) {
      return result
    }

    // update / patch are shared
    const event = Audit.events.UPDATE

    // save audit
    await createAudit(event, {request, auth}, auditable, auditableId, oldData, newData)

    return result
  }
}

/**
 * Delete with audit
 *
 * @param auth
 * @param request
 * @returns {*}
 */
function deleteWithAudit ({request, auth}) {
  return async function () {
    const auditable = this.constructor.name
    const auditableId = this.id
    const oldData = this.$originalAttributes
    const result = await this.delete()

    // save audit
    await createAudit(Audit.events.DELETE, {request, auth}, auditable, auditableId, oldData)

    return result
  }
}

/**
 * Run the audit
 *
 * @param event
 * @param oldData
 * @param auditable
 * @param auditableId
 * @param newData
 * @param auth
 * @param request
 * @returns {Promise<void>}
 */
async function createAudit (event, {request, auth}, auditable, auditableId, oldData, newData) {
  // check auth was passed
  if (!auth) {
    throw new Error('Auth param is empty')
  }

  // check request was passed
  if (!request) {
    throw new Error('Request param is empty')
  }

  // get user data to store
  const userId = auth.user.id
  const url = request.absoluteUrl()
  const ip = request.ip()

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

module.exports = Auditable
