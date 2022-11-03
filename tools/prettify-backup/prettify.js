const fs = require('fs')
const { JSDOM } = require('jsdom')
const { parse } = require('date-fns')

module.exports = {
  extractRelevantInformation,
}

function extractRelevantInformation (page) {
  const data = extractData(page)

  return prettifyData(data)
}

/**
 *
 * @param {HTMLElement[]} page
 * @returns
 */
function extractData (page) {
  const postsData = []

  page.forEach(post => {
    const votes = []

    const author = post.querySelector('.element_username').innerText

    const content = post.querySelector('.post-content').innerHTML.trim()

    const postedString = post.querySelector('.posted').innerText
    const splits = postedString.split(' ')
    const postedDate = parse(`${splits[1]} ${splits[2]} ${splits[3]}`, 'MMM d, yy', new Date())

    const postVotes = post.querySelectorAll('.vote')

    postVotes.forEach(vote => {
      const name = vote.querySelector('.vote_name').innerText
      const people = []

      const users = vote.querySelectorAll('.user')

      users.forEach(user => {
        people.push(user.childNodes[1].attrs['data-minitooltip'])
      })

      const voteData = {
        name,
        people,
        amount: people.length,
      }

      votes.push(voteData)
    })

    const postData = {
      author,
      content,
      votes,
      posted: postedDate,
    }

    postsData.push(postData)
  })

  return postsData
}

/**
 *
 * @param {{
 *  author: string,
 *  content: string,
 *  votes: {name: string, amount: number, people: string[]}[],
 *  posted: Date
 * }[]} pageData
 */
function prettifyData (pageData) {
  const dom = new JSDOM('<!DOCTYPE html>')

  const document = dom.window.document
  const table = document.createElement('div')

  table.className = 'table'

  pageData.forEach(post => {
    const tr = document.createElement('div')

    tr.className = 'row'

    const authorTd = document.createElement('div')
    const content = document.createElement('div')

    const author = document.createElement('p')
    const date = document.createElement('p')
    const votes = document.createElement('p')

    authorTd.className = 'author-cell'

    author.innerHTML = `${post.author}`
    author.className = 'author'

    content.innerHTML = post.content
    content.className = 'content'

    date.innerHTML = `on: ${post.posted.toISOString()}`
    date.className = 'date'

    post.votes.forEach(vote => {
      const p = document.createElement('p')

      p.className = 'votes'

      p.innerHTML = `${vote.name} (${vote.amount}) - ${vote.people.join(', ')}`

      votes.appendChild(p)
    })

    authorTd.appendChild(author)
    authorTd.appendChild(date)
    authorTd.appendChild(votes)

    tr.appendChild(authorTd)
    tr.appendChild(content)

    table.appendChild(tr)
  })

  const style = document.createElement('style')

  style.innerHTML = fs.readFileSync('tools/prettify-backup/style.css')

  document.head.appendChild(style)
  document.body.appendChild(table)

  return dom.serialize()
}
