const fs = require('fs')

const { getPageContent } = require('../../util/request-processor')

const prefix = 'https://theashenchapter.enjin.com'
const forums = require('./forums')

main()

const ashenChapter = {}

async function main () {
  await loopForums(forums)

  fs.writeFileSync('tools/tree-view/result.json', JSON.stringify(ashenChapter, null, 2))
}

async function loopForums (forums) {
  for (const forum of forums) {
    let threads = []
    let forums = []
    let subForums = []

    try {
      threads = await getPageContent(`${prefix}${forum.url}`, '.thread-subject')
      forums = await getPageContent(`${prefix}${forum.url}`, '.forum-name')

      subForums = loopForums(forums.map(node => ({ name: node.innerText.trim(), url: `${prefix}${node.attrs.href}` })))
    } catch (e) {
    }
    ashenChapter[forum.name] = {
      url: forum.url,
      threads: threads.map(node => ({ name: node.innerText.trim(), url: `${prefix}${node.attrs.href}` })),
      subForums,
    }
  }
}
