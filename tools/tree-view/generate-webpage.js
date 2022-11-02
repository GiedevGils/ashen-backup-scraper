const fs = require('fs')
const { JSDOM } = require('jsdom')
const format = require('date-fns/format')
const { upload } = require('../../util/ftp')

module.exports = {
  generate,
}
let dom
let document

generate()

function generate () {
  dom = new JSDOM('<!DOCTYPE html>')
  document = dom.window.document
  const style = document.createElement('style')

  style.innerHTML = fs.readFileSync('./tools/tree-view/style.css')

  document.head.appendChild(style)

  const tree = JSON.parse(fs.readFileSync('./tools/tree-view/result.json'))

  const ul = document.createElement('ul')

  for (const item of tree) {
    createElementsFromForum(item, ul)
  }

  document.body.appendChild(ul)

  fs.writeFileSync('tools/tree-view/tach-forum-tree.html', dom.serialize())

  upload('tools/tree-view/tach-forum-tree.html', 'forum.html')
}

function createElementsFromForum (forum, parent) {
  const forumLi = document.createElement('li')
  const forumLink = document.createElement('a')

  forumLink.href = forum.url
  forumLink.innerHTML = forum.name
  forumLink.className = 'forum'

  forumLi.appendChild(forumLink)

  if (forum.threads) {
    const threads = document.createElement('ul')

    for (const thread of forum.threads) {
      const th = document.createElement('li')
      const thLink = document.createElement('a')
      const p = document.createElement('span')

      thLink.href = thread.url
      thLink.innerHTML = `${thread.name}`
      p.innerHTML = ` | by: ${thread.by} | on: ${format(new Date(thread.on), 'yyyy-MM-dd')} | nr of posts: ${thread.nrOfPosts}`
      th.appendChild(thLink)
      th.appendChild(p)

      threads.appendChild(th)
    }

    for (const subForum of forum.subForums) {
      const subThreads = document.createElement('ul')

      createElementsFromForum(subForum, subThreads)

      forumLi.appendChild(subThreads)
    }

    forumLi.appendChild(threads)
  }

  parent.appendChild(forumLi)
}
