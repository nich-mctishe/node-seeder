const _ = require('lodash')

/**
 * Ucfirst
 * Capitalisation of first letter
 * @param {String} string
 *
 * @returns {String}
 */
const ucfirst = (string) => {
  return string.substr(0, 1).toUpperCase() + string.substr(1)
}

/**
 * Class Case
 * Converts string to class case (i.e. SomeKindOfClassName)
 * @param {String} string
 *
 * @returns {String}
 */
const classCase = (string) => {
  return ucfirst(_.camelCase(string))
}

/**
 * Is Title
 * check whether the word starts with a cap
 * @param {String} word
 *
 * @returns {Bool}
 */
const isTitle = (word) => {
  return /^[A-Z]/.test(word)
}

// maybe change this to class based interation
function helper () {}

helper.prototype.logging = {
  /**
   * Logging init
   * @param {Object} meta = information about the seeder passed in
   */
  init: (meta) => {
    console.log('running database seeder ' + meta.name + ' please check file meta for more information.')
  }
}

helper.prototype.string = {
  ucfirst: ucfirst,
  classCase: classCase,
  isTitle: isTitle
}

helper.prototype.format = {
  /**
   * Formats from xml to JSON following the structre followed in other examples
   * TODO: finish this formatter
   * @param {Object} data = xml parsed data
   */
  toStandardType: (data) => {
    let formatted = data // []

    // _.each(data.root.children, (element) => {
    //   let model = {
    //
    //   }
    //   console.log(element)
    //
    //
    // })

    return formatted
  }
}

helper.prototype.line = {
  /**
   * Has Parent
   * Determines if data passed in in the model structure contains a relationship to a parent
   * @param {Object} data
   *
   * @returns {Bool}
   */
  hasParent: (data) => {
    let hasParent = false
    _.each(data, (field, index) => {
      if (_.isPlainObject(field) &&
        _.get(field, 'model') &&
        _.get(field, 'type') === 'parent') {
        hasParent = true
      }
    })

    return hasParent
  }
}

helper.prototype.model = {
  /**
   * Insert
   * Handles simple insertion to database based on a findOrCreate
   * @param {Mongoose} model
   * @param {Object} search = the value to be reference in the db
   * @param {Object} data = insert data
   * @param {Function} callback
   *
   * @returns {Function}
   */
  insert: (model, search, data, callback) => {
    if (!model) {
      return console.error('model not defined')
    }
    if (!model.findOrCreate) {
      return console.error('this seeder requires mongoose-find-or-create or equivilent set as a plugin in order to use the findOrCreate functionality')
    }

    model.findOrCreate(search, data,
      (err, res) => {
        if (err) {
          return callback(err)
        }

        return callback()
      })
  },
  /**
   * Insert Parent
   * finds parent of child based on search criteria, add the id to the
   * passed in object then insert the parent into the database based
   * on a findOrCreate
   * @param {Mongoose} model = the child model
   * @param {Mongoose} parentModel = the main model for lookup
   * @param {Object} search = the child value to be reference in the db
   * @param {Object} parentSearch = the parent value to be reference in the db
   * @param {String} parentIndex = the name of the relation field on the parent object
   * @param {Object} data = insert data
   * @param {Function} callback
   *
   * @returns {Function}
   */
  insertParent: (model, parentModel, search, parentSearch, parentIndex, data, callback) => {
    model.findOne(search).exec((err, result) => {
      if (err) {
        return callback(err)
      }
      if (!result) {
        return callback()
      }

      data[parentIndex] = result._id
      parentModel.findOrCreate(parentSearch, data, (err, res) => {
        if (err) return callback(err)

        return callback()
      })
    })
  },
  find: {
    /**
     * Parent
     * finds the child object in the db.
     * @param {Object} line = the parent object
     *
     * @returns {Object}
     */
    parent: (line) => {
      let parent = {}

      _.each(line, (field, index) => {
        if (_.isPlainObject(field) &&
          _.get(field, 'model') &&
          _.get(field, 'type') === 'parent') {
          parent = field
        }
      })

      return parent
    },
    /**
     * Parent Index
     * finds the index of the field to be updated
     * @param {Object} line = the parent object
     *
     * @returns {String}
     */
    parentIndex: (line) => {
      let index = null

      _.each(line, (field, i) => {
        if (_.isPlainObject(field) &&
          _.get(field, 'model') &&
          _.get(field, 'type') === 'parent') {
          index = i
        }
      })

      return index
    }
  }
}

module.exports = helper
