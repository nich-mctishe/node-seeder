const fs = require('fs')
const path = require('path')

/**
 * @var {object}
 */
const locations = {
  updates: 'updates/',
  data: 'data/'
}
/**
 * @var {object}
 */
const manifest = {
  updates: '../../../seeder/updates',
  data: '../../../seeder/data'
}
/**
 * Copy File
 * @param {String} source
 * @param {String} target
 *
 * @returns {void}
 */
const copyFile = (source, target) => {
  fs.writeFileSync(target, fs.readFileSync(source))
}
/**
 * Recursively Copy Directory
 * @param {String} source
 * @param {String} target
 *
 * @returns {void}
 */
const recursivelyCopyDir = (source, target) => {
  let files = []

  // copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source)
    files.forEach(file => {
      const curSource = path.join(source, file)
      const curTarget = path.join(target, file)
      if (fs.lstatSync(curSource).isDirectory()) {
        recursivelyCopyDir(curSource, target)
      } else {
        copyFile(curSource, curTarget)
      }
    })
  }
}

/**
 * Manifests
 * for each manifest folder
 *
 * @returns {Object}
 */
const manifests = Object.entries(manifest)
for (const [index, location] of manifests) {
  const target = path.resolve(__dirname, location)
  const source = path.resolve(__dirname, '../', locations[index])
  // check folder exists
  if (fs.existsSync(source)) {
    // if folder is empty
    if (fs.readdirSync(source).length) {
      // transfer folder contents (assuming all files)
      recursivelyCopyDir(source, target)
    }
  }
}

// ! template.js
if (!fs.existsSync(path.resolve(__dirname, '../../seeder', 'template.js'))) {
  // copy over template.js
  copyFile(
    path.resolve(__dirname, '../', 'template.js'),
    path.resolve(__dirname, '../../../seeder/template.js')
  )
}
