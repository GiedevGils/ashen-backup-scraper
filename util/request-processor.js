const dotenv = require('dotenv')
const fetch = require('node-fetch')
const { parse } = require('node-html-parser')

dotenv.config()

const cookie = process.env.cookie // cookie contains login data to access blocked threads

module.exports = {
  getPageContent,
}

async function getPageContent (url) {
  const response = await request(url)

  return await parseHtml(response)
}

async function request (url) {
  return await fetch(url, {
    headers: {
      cookie,
    },
  })
}

async function parseHtml (res) {
  const resHtml = await res.text()
  const html = parse(resHtml)

  const content = html.querySelector('.viewthread')

  if (content === null) {
    throw new Error('page has no thread')
  }

  return content.toString()
}
