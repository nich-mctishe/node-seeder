
const tests = [
  './helpers/default',
  './test-index',
  './tools-postinstall'
]

tests.forEach((test) => {
  console.log('running unit test for ' + test)

  require(test)
})
