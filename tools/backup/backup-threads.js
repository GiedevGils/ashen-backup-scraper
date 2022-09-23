const fs = require('fs')

const pages = require('./pages.js')
const { updateCurrentPage, startLog, endLog, addToDone } = require('../../util/logger.js')
const { getPageContent } = require('../../util/request-processor.js')

main()

async function main () {
  startLog(pages.reduce((x, y) => x + y.numberOfPages, 0))

  for (const page of pages) {
    const { name, url, numberOfPages } = page

    updateCurrentPage(page)

    console.log(`doing thread | ${name} - pgs: ${numberOfPages}`)

    await fs.mkdirSync(`./tools/backup/output/${name}`, { recursive: true })

    for (let idx = 1; idx <= numberOfPages; idx++) {
      const path = `./tools/backup/output/${name}/page-${idx}.html`

      if (fs.existsSync(path) && idx !== numberOfPages) { // if it is the same page, re-get it for the fact that posts might have been updated
        addToDone()
        continue
      }

      try {
        const content = await getPageContent(`${url}/page/${idx}`, '.viewthread')

        fs.writeFileSync(path, content[0].toString()) // should be only 1 element with class threadview
      } catch (err) {
        console.error(`error at ${name}, ${idx}`)
        fs.appendFileSync('backup-fails.txt', `${new Date().toISOString()} | ${name}, ${idx} (${url}) | ${err.message}\n`)
      }

      addToDone()
    }
  }

  endLog()
}
