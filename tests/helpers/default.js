const expect = require('chai').expect
const Lib = require('../../helpers/default')
const lib = new Lib()

const data = {
  string: {
    ucFirst: {
      input: 'word',
      expected: 'Word'
    },
    classCase: {
      input: 'classCasePhrase',
      expected: 'ClassCasePhrase'
    },
    isTitle: [{
      input: 'Title',
      expected: true
    }, {
      input: 'title',
      expected: false
    }]
  },
  model1: {
    'model': 'test',
    'data': {
      'name': 'Nich',
      'slug': 'nich',
      'value': 1,
      'testRelationship': {
        'type': 'parent',
        'model': 'test',
        'data': {
          'slug': 'nich'
        }
      }
    }
  },
  model2: {
    'model': 'testRelationship',
    'data': {
      'name': 'Nich',
      'slug': 'nich',
      'value': 1
    }
  }
}

describe('Helpers - Data', () => {
  describe('helper.string.ucfirst', () => {
    it('Converts word to capital letter first', () => {
      const ucFirst = lib.string.ucfirst(data.string.ucFirst.input)

      expect(ucFirst).to.equal(data.string.ucFirst.expected)
    })
  })

  describe('helper.string.classCase', () => {
    it('Converts word to class case', () => {
      const classCase = lib.string.classCase(data.string.classCase.input)

      expect(classCase).to.equal(data.string.classCase.expected)
    })
  })

  describe('helper.string.isTitle', () => {
    it('Determines if string begins with cap', () => {
      const isTitle = lib.string.isTitle(data.string.isTitle[0].input)
      const isNotTitle = lib.string.isTitle(data.string.isTitle[1].input)

      expect(isTitle).to.equal(data.string.isTitle[0].expected)
      expect(isNotTitle).to.equal(data.string.isTitle[1].expected)
    })
  })

  describe('helper.line.hasParent', () => {
    it('determines if model has parent model', () => {
      const hasParent = lib.line.hasParent(data.model1.data)
      const hasNotParent = lib.line.hasParent(data.model2.data)

      expect(hasParent).to.equal(true)
      expect(hasNotParent).to.equal(false)
    })
  })

  // describe('helper.model.find.parent', () => {
  //   it('finds parent model', () => {
  //     const parent = lib.model.find.parent(data.model1.data)
  //     const noParent = lib.model.find.parent(data.model2.data)
  //
  //     expect(parent).to.equal({
  //       'slug': 'nich'
  //     })
  //     expect(noParent).to.equal({})
  //   })
  // })

  describe('helper.model.find.parentIndex', () => {
    it('get parent model index', () => {
      const parentIndex = lib.model.find.parentIndex(data.model1.data)

      expect(parentIndex).to.equal('testRelationship')
    })
  })
})
