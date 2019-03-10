# Node seeder

Small lightweight seeder for express based apps, that can seed from JSON, XML, CSV or YAML

## Contents

1. Requirements
2. Installation
3. Setup
4. Templates
5. Helper Functions
6. Data files

## Requirements

Node
Express
Mongoose
Mongoose find-or-create

## Installation

add to package.json. installation will run on postinstall.

The seeder will come out of the box with a test seed named test. In order to test the effectiveness of this seed you will need to create a test and test relationship model, which will need to have the following fields:

- testRelationship
  1. name ( String, required)
  2. slug ( String, required)
  3. value ( Number, required)
- test
  1. name ( String, required)
  2. slug ( String, required)
  3. value ( Number, required)
  4. testRelationship ( Schema.Types.ObjectId, ref 'TestRelationship')

## Setup

In order to be able to test the basic seed you will need to pass in the above models in an object with the models names, like this:

```
{
  "test": Test,
  "testRelationship": TestRelationship
}
```

Normally, it's best to run the seeder when the server is initiated, as it will scan the database for implementations and seed any template that isn't already present each time the server is reloaded. a sample setup (in express) may be as follows

```
const express = require('express')
const mongoose = require('mongoose')
const seeder = require('node-seeder')
const location = path.join(__dirname, '/../../seeder/updates/')
const models = {
  "test": require('models/test'),
  "testRelationship": require('models/testRelationship')
}
// or alternative the models folder could be fetched, required, and passed in recursively.

mongoose
.plugin(require('mongoose-find-or-create'))
.set('debug', dev)
.connect(process.env.MONGO_URL)
.then(() => {
  seeder.run(location, models, () => {
    // put your application code here

    })
})
```

the seeder will stat the seeder/updates folder and determine what template files are in it. Then it will cycle through each one. It will search the database of ran upload records, upload the file to db, if required, and then save the record to the updates collection in the db.

## Templates

in order to build your own template, you can duplicate the template file you will find in seeder/template.js . This file will need to be placed in the seeder/updates folder along with a subject matter and the date (in db string format). for example users-2018-01-01.js. In this folder you will find a meta object that for readability you should update with a name, author, and a description.

once this has been done, any code can be run and any external modules can be called. Please note that any supplementary seeder data will be passed in (see Data files section) if provided, as the data value, along with models as the models variable, and a series of custom helpers, in the helpers object. once you have performed the seed, then call `next()`, this can also accept an error as its first argument.

## Helper Functions

`helper.string.ucFirst(string)`
Capitalisation of first letter

`helper.string.camelCase(string)`
Converts string to class case (i.e. SomeKindOfClassName)

`helper.line.hasParent(Object data)`
Determines if data passed in in the model structure contains a relationship to a parent

`helper.model.insert(Mongoose model, String search, Object data, Function callback)`
Handles simple insertion to database based on a findOrCreate

`helper.model.insertParent(Mongoose model, Mongoose parentModel, String search, Strong parentSearch, String parentIndex, Object data, Function callback)`
finds parent of child based on search criteria, add the id to the passed in object then insert the parent into the database based on a findOrCreate

`helper.model.find.parent(Object line)`
finds the child object in the db.

`helper.model.find.parentIndex(Object line)`
finds the index of the field to be updated

## Data files

once a template file has been made, a data file with all the date to be seeded can be made and added to seeder/data.

node-seeder will recognise 4 different data formats: yml, json, csv, xml. and will priorise them in that order (ie: if you have a yml and json data file of the same name, it will choose the yml file to seed).

in order to make a data file, create a new file in seeder/data to your preferred format and name it the same as the template js file. for example, the file users-2018-01-01.js may have a csv file with the name users-2018-01-01.csv
