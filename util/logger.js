const interval = setInterval(() => {
  console.log('------------')
  console.timeLog('duration')
  console.log(`doing page: ${page.name}`)
  console.log(`done so far: ${done}`)
  console.log(`remaining: ${total - done}`)
  console.log('------------')
}, 10000)

let start = null

let total = -1
let page
let done = 0

module.exports = {
  startLog, endLog, addToDone, updateCurrentPage,
}

function startLog (amount) {
  start = new Date()
  total = amount
  console.log(`start time: ${start.toISOString()}`)
  console.log(`total: ${amount}`)
  console.time('duration')
  console.log('----')
}

function endLog () {
  clearInterval(interval)
  console.log('----')
  console.log(`start: ${start.toISOString()}`)
  console.timeEnd('duration')
  console.log(`total: ${total}`)
}

function addToDone () {
  done++
}

function updateCurrentPage (newPage) {
  page = newPage
}
