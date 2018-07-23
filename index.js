const _ = require('lodash')
const fs = require('fs')
const async = require('async')
const Helper = require('./helpers/default')
const support = require('./helpers/seeder')
const Data = require('./helpers/data')

/**
 * Get Data
 * a bridging function between the requirer and the Data class. retrieves seeder data.
 * See data class for more info
 * @param {String} folder
 * @param {String} file
 *
 * @returns {Object}
 */
const getData = (folder, file) => {
  // this will become helper
  let data = new Data(file, folder + '../data/')

  return data.get()
}

/**
 * Run Seed
 * Gets the yml data and runs the seeder instruction
 * @param {String} folder
 * @param {String} file
 * @param {Function} callback
 *
 * @returns String
 */
const runSeed = (models, folder, file, callback) => {
  require(folder + file)(getData(folder, file), models, new Helper(), (error) => {
    if (error) return callback(error)

    callback(null, file)
  })
}

module.exports = {
  /**
   * Run
   * runs the seeder, which will look through all files in the updates folder and
   * match them with data in the data folder and upload what it finds to the database
   * @param {String} folder = the base folder
   * @param {Object} models = the model instances available
   * @param {Function} next
   */
  run: (folder, models, next) => {
    // cycle through files in updates folder
    console.log('checking seeder for database updates')
    fs.readdir(folder, (err, files) => {
      if (err) {
        return next(err)
      }

      if (!files.length) {
        console.log('no files in updates folder, moving on to next process')

        return next()
      }

      async.eachSeries(support.orderFiles(files), (file, callback) => {
        if (file === '.DS_Store') return callback()

        let name = _.trimEnd(file, '.js')
        console.log('beginning seeding for file ' + name)

        async.waterfall([
          // for ecach file check if ref exists in db
          async.apply(support.update.find, name),
          // if file not in db:
          // action file
          // get data file
          // passin helper
          // save file on callback
          async.apply(runSeed, models, folder),
          support.update.record
        ], err => {
          if (err) console.log(err)

          return callback()
        })
      }, err => {
        if (err) console.log(err)

        next()
      })
    }, (err) => {
      if (err) console.log(err)

      next()
    })
  }
}
