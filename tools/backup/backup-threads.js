const fs = require('fs')

const { updateCurrentPage, startLog, endLog, addToDone } = require('../../util/logger.js')
const { getPageContent } = require('../../util/request-processor.js')
const path = require('path')
const { extractRelevantInformation } = require('../prettify-backup/prettify.js')

main()

async function main () {
  const forums = JSON.parse(fs.readFileSync(path.join(__dirname, './forum.json')))

  startLog(Math.ceil(getCount(forums, 0) / 10))

  fs.cpSync(path.join(__dirname, '../tree-view/result.json'), path.join(__dirname, './forum.json'))
  const outputPath = path.join(__dirname, './output')

  for (const forum of forums) {
    await backup(outputPath, forum)
  }

  endLog()
}

async function backup (parentPath, forum) {
  const forumPath = `${parentPath}/${format(forum.name)}`

  fs.mkdirSync(forumPath, { recursive: true })

  for (const subForum of forum.subForums) {
    await backup(forumPath, subForum)
  }

  for (const thread of forum.threads) {
    const { name, url, nrOfPosts, by } = thread

    updateCurrentPage(thread)

    console.log(`doing thread | ${name} - pgs: ${Math.ceil(nrOfPosts / 10)}`)

    await fs.mkdirSync(forumPath, { recursive: true })

    for (let idx = 1; idx <= Math.ceil(nrOfPosts / 10); idx++) {
      const path = `${forumPath}/${format(name)}__${format(by)}`
      const filePath = `${path}/page-${idx}.html`

      fs.mkdirSync(path, { recursive: true })

      if (fs.existsSync(filePath) && idx !== nrOfPosts) { // if it is the same page, re-get it for the fact that posts might have been updated
        addToDone()
        continue
      }

      try {
        const content = await getPageContent(`${url}/page/${idx}`, '.row')

        const prettified = extractRelevantInformation(content)

        fs.writeFileSync(filePath, prettified)
      } catch (err) {
        console.error(`error at ${name}, ${idx}: ${err}`)
        fs.appendFileSync('tools/backup/backup-fails.txt', `${new Date().toISOString()} | ${name}, ${idx} (${url}) | ${err.message}\n`)
      }

      addToDone()
    }
  }
}

function format (str) {
  return (str + '')
    .replaceAll(' ', '_')
    .replaceAll('/', '.')
    .replaceAll('\\', '..')
    .replaceAll(':', '=')
    .replaceAll('*', '+')
    .replaceAll('?', ',,')
    .replaceAll('"', ',')
    .replaceAll('|', '...')
    .toLowerCase()
}

function getCount (forums) {
  let count = 0

  for (const forum of forums) {
    for (const thread of forum.threads) {
      if (thread.nrOfPosts) {
        count += +thread.nrOfPosts
      }
    }

    if (forum.subForums.length > 0) {
      count += getCount(forum.subForums)
    }
  }
  return count
}
