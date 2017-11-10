'use strict'

const Model = use('Model')

class Audit extends Model {
  /**
   * @returns {null}
   */
  static get updatedAtColumn () {
    return null
  }

  /**
   * Auditable events
   *
   * @returns {Object}
   */
  static get events () {
    return Object.freeze({
      CREATE: 'create',
      UPDATE: 'update',
      DELETE: 'delete',
    })
  }

  /**
   * @param value
   * @returns {any}
   */
  getOldData (value) {
    if (value) {
      return JSON.parse(value)
    }
  }

  /**
   * @param value
   * @returns {any}
   */
  setOldData (value) {
    if (value !== null) {
      return JSON.stringify(value)
    }
  }

  /**
   * @param value
   * @returns {any}
   */
  getNewData (value) {
    if (value) {
      return JSON.parse(value)
    }
  }

  /**
   * @param value
   * @returns {any}
   */
  setNewData (value) {
    if (value !== null) {
      return JSON.stringify(value)
    }
  }
}

module.exports = Audit
