const _ = require('lodash')
const updates = require('../models/updates')

module.exports = {
  /**
   * Order Files
   * Sorts files by date
   * @param {Array} files = files to sort
   *
   * @returns {Array}
   */
  orderFiles: (files) => {
    return _.sortBy(files, function (f) {
      return f.match(/\d{4}-\d{2}-\d{2}/)
    })
  },
  update: {
    /**
     * Find
     finds a record of the seed and continues if one is not there
     * @param {String} file
     *
     * @returns String
     */
    find: (file, next) => {
      updates.findOne({ key: file }, (err, update) => {
        if (err) return next(err)

        if (!update) {
          return next(null, file)
        } else {
          return next('database seed record for ' + file + ' found, skipping...')
        }
      })
    },
    /**
     * Record
     * records that the seed was successful
     * @param {String} file
     *
     * @returns String
     */
    record: (file, next) => {
      updates.create({ key: file }, (err, res) => {
        if (err) return next(err)

        next(null, file)
      })
    }
  }
}
