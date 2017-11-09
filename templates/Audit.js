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
   * @returns {string}
   */
  static get EVENT_CREATE () {
    return 'create'
  }

  /**
   * @returns {string}
   */
  static get EVENT_UPDATE () {
    return 'update'
  }

  /**
   * @returns {string}
   */
  static get EVENT_PATCH () {
    return 'patch'
  }

  /**
   * @returns {string}
   */
  static get EVENT_DELETE () {
    return 'delete'
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
    if (value !== null && typeof value === 'object') {
      return JSON.stringify(value)
    }
    return value
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
    if (value !== null && typeof value === 'object') {
      return JSON.stringify(value)
    }
  }
}

module.exports = Audit
