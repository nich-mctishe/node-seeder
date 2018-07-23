const fs = require('fs')
const _ = require('lodash')
// const debug = require('util').inspect

const csvParse = (data, extra) => {
  const CSV = require('comma-separated-values')
  let csv = new CSV(data, { header: true, cast: false })

  return csv.parse()
}

const method = {
  yml: require('js-yaml').safeLoad,
  xml: require('xml-parser'),
  csv: csvParse, // require('csvjson').toObject,
  /**
   * JSON
   * converts string to json
   * @param {String} file
   *
   * @returns {Object}
   */
  json: (file) => {
    try {
      return JSON.parse(file)
    } catch (e) {
      console.log('unable to parse file ' + file + ' skipping')

      return {}
    }
  }
}

/**
 * Check
 * Checks whether a file of a given name and format exists.
 * @param {String} folder
 * @param {String} file
 * @param {String} extension
 *
 * @returns {Bool}
 */
const check = (folder, file, extension) => {
  return (fs.existsSync(folder + file + '.' + extension))
}
/**
 * @class Data
 * determines and returns formatted data for a seeder.
 */
class Data {
  /**
   * constructor
   * @param {String} file
   * @param {String} dataLocation = location of the data folder
   */
  constructor (file, dataLocation) {
    this.file = file
    this.folder = dataLocation
    this.has = {
      yml: false,
      xml: false,
      json: false,
      csv: false
    }

    this.lookup()
  }

  /**
   * Lookup
   * amends the this.has object to refelct whether a file of a certain format is present
   */
  lookup () {
    let instance = this
    _.each(this.has, (type, extension) => {
      instance.has[extension] = check(instance.folder, instance.file, extension)
    })
  }

  /**
   * Get
   * Gets data based on the first file format it can find
   *
   * @returns {Object}
   */
  get () {
    let data = {
      yml: false,
      xml: false,
      json: false,
      csv: false
    }
    _.each(this.has, (present, extension) => {
      if (!present) return delete data[extension]
      data[extension] = method[extension](
        fs.readFileSync(this.folder + this.file + '.' + extension, 'utf8'), {})
    })

    return data[Object.keys(data)[0]]
  }
}

module.exports = Data
