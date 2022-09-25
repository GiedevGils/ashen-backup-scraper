const fs = require('fs')

const { updateCurrentPage, startLog, endLog, addToDone } = require('../../util/logger.js')
const { getPageContent } = require('../../util/request-processor.js')
const path = require('path')

main()

async function main () {
  const pages = JSON.parse(fs.readFileSync(path.join(__dirname, './forum.json')))

  startLog(-1)

  fs.cpSync(path.join(__dirname, '../tree-view/result.json'), path.join(__dirname, './forum.json'))
  const outputPath = path.join(__dirname, './output')

  for (const page of pages) {
    backup(outputPath, page)
  }

  endLog()
}

async function backup (parentPath, forum) {
  for (const thread of forum.threads) {
    console.log(thread.name)
    const { name, url, nrOfPosts } = thread

    updateCurrentPage(thread)

    console.log(`doing thread | ${name} - pgs: ${nrOfPosts}`)

    await fs.mkdirSync(parentPath, { recursive: true })

    for (let idx = 1; idx <= nrOfPosts; idx++) {
      const path = `${parentPath}/${name.toLowerCase().replace(' ', '_')}/page-${idx}.html`

      if (fs.existsSync(path) && idx !== nrOfPosts) { // if it is the same page, re-get it for the fact that posts might have been updated
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
}
