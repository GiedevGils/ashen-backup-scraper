const fs = require('fs')
const { parse } = require('date-fns')

const { getPageContent } = require('../../util/request-processor')
const { parseString } = require('../../util/string')

const prefix = 'https://theashenchapter.enjin.com'
const uniqueItems = new Set()

main()

async function main () {
  console.time('totalTime')
  const ashenChapter = []

  const coreForums = await getPageContent(prefix, '.forum-name') // get initial pages

  await loopForums(ashenChapter, coreForums.map(node => ({ name: parseString(node.innerText), url: `${node.attrs.href}` })))

  fs.writeFileSync('tools/tree-view/result.json', JSON.stringify(ashenChapter, null, 2))
  console.timeEnd('totalTime')
}

async function loopForums (parent, forums) {
  for (const forum of forums) {
    console.timeLog('totalTime')
    const threads = []
    let pageForums = []
    const subForums = []
    const url = `${prefix}${forum.url}`

    let loopThreads = true
    let currentThread = 1

    try {
      const pageContents = await getPageContent(url, '.forum-content')
      const pageContent = pageContents[0]
      let nextThreadContents

      while (loopThreads) {
        console.log(`getting ${forum.name} - page ${currentThread}`)
        nextThreadContents = currentThread === 1 ? pageContents : await getPageContent(`${url}/page/${currentThread}`, '.forum-content')
        const nextThreadContent = nextThreadContents[0]

        const threadContent = nextThreadContent.querySelectorAll('.thread-subject')

        if (threadContent.length === 0) {
          loopThreads = false
          break
        }

        const nodes = threadContent.map(nodeMapper)

        const filteredNodes = nodes.filter(node => !uniqueItems.has(node.name))

        filteredNodes.forEach(node => {
          uniqueItems.add(node.name)
        })

        threads.push(...filteredNodes)
        currentThread++
      }

      pageForums = pageContent.querySelectorAll('.forum-name')

      if (pageForums.length > 0) {
        await loopForums(subForums, pageForums.map(node => ({ name: parseString(node.innerText), url: `${node.attrs.href}` })))
      }
    } catch (e) {
      console.error(`error getting forums ${forum.name} - ${e.message}`)
      throw e
    }

    parent.push({
      name: parseString(forum.name),
      url: forum.url[0] === 'h' ? forum.url : url, // lazy. check if https is already in front of the url. if not, take the url used to send requests.
      threads,
      subForums,
    })
  }
}

const nodeMapper = node => {
  const forumName = node.textContent.trim()
  const name = parseString(forumName)

  return {
    name,
    url: `${prefix}${node.attrs.href}`,
    by: node.parentNode.querySelector('.by')?.querySelector('.element_username')?.innerText,
    nrOfPosts: node.parentNode.parentNode.querySelector('.replies')?.innerText.trim(),
    on: parse(node.parentNode.attrs['data-lastposttime'], 'MMM d, yy', new Date()),
  }
}
