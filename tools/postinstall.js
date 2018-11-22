const fs = require('fs')
const path = require('path')

const locations = {
  updates: 'updates/',
  data: 'data/'
}

const manifest = {
  updates: '../../seeder/updates',
  data: '../../seeder/data'
}

const copyFile = (source, target) => {
  let targetFile = target

  if (fs.existsSync(target)) {
    if ( fs.lstatSync( target ).isDirectory() ) {
        targetFile = path.join( target, path.basename( source ) );
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
  }
}
const recursivelyCopyDir = (source, target) => {
  let files = []
  const targetFolder = path.join( target, path.basename( source ) )

  //check if folder needs to be created or integrated
  if ( !fs.existsSync( targetFolder ) ) {
      fs.mkdirSync( targetFolder )
  }

  //copy
  if ( fs.lstatSync( source ).isDirectory() ) {
      files = fs.readdirSync( source )
      files.forEach( file => {
          const curSource = path.join( source, file )
          if ( fs.lstatSync( curSource ).isDirectory() ) {
              copyFolderRecursiveSync( curSource, targetFolder );
          } else {
              copyFileSync( curSource, targetFolder )
          }
      } );
  }
}

// for each manifest folder
manifest.forEach((location, index) => {
  const source = path.resolve(__dirname, location)
  const target = path.resolve(__dirname, locations[index])
  // check folder exists
  if (fs.existsSync(loc)) {
    // if folder is empty
    if (fs.readdirSync(loc).length) {
      // transfer folder contents (assuming all files)
      recursivelyCopyDir(source, target)
    }
  }
})

// ! template.js
if (!fs.existsSync(path.resolve(__dirname, 'template.js'))) {
  // copy over template.js
  copyFile (
    path.resolve(__dirname, 'template.js'),
    path.resolve(__dirname, '../../seeder', 'template.js')
  )
}
