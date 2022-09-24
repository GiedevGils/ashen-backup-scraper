const dotenv = require('dotenv')
const fetch = require('node-fetch')
const { parse } = require('node-html-parser')

dotenv.config()

const cookie = process.env.cookie // cookie contains login data to access blocked threads

module.exports = {
  getPageContent,
}

async function getPageContent (url, selector) {
  if (!url || !selector) throw new Error('missing param in getPageContent call')
  const response = await request(url)

  return await parseHtml(response, selector)
}

async function request (url) {
  return await fetch(url, {
    headers: {
      cookie,
    },
  })
}

async function parseHtml (res, selector) {
  const resHtml = await res.text()
  const html = parse(resHtml)

  const content = html.querySelectorAll(selector)

  if (content.length === 0) {
    throw new Error(`page has no elements with selector ${selector}`)
  }

  return content
}
