const fs = require('fs')
const path = require('path')

// fs.cpSync(path.join(__dirname, '../header-duplication/stylesheets'), path.join(__dirname, 'stylesheets'), { recursive: true })
// fs.cpSync(path.join(__dirname, '../backup/output'), path.join(__dirname, 'threads'), { recursive: true })

const styles = fs.readdirSync(path.join(__dirname, 'stylesheets'))

// let headers = '<head>'

// for (const style of styles) {
//   headers = headers + `<link href="../../stylesheets/${style}" type="text/css" rel="stylesheet">`
// }

// headers = headers + '</head><body>'

// const folders = fs.readdirSync(path.join(__dirname, 'threads'))

// for (const folder of folders) {
//   const files = fs.readdirSync(path.join(__dirname, `threads/${folder}`))

//   for (const file of files) {
//     const filepath = path.join(__dirname, `threads/${folder}/${file}`)

//     const data = fs.readFileSync(filepath)
//     const fd = fs.openSync(filepath, 'w+')
//     const insert = Buffer.from(headers)

//     fs.writeSync(fd, insert, 0, insert.length, 0)
//     fs.writeSync(fd, data, 0, data.length, insert.length)
//     fs.close(fd, err => { if (err) throw err })

//     fs.appendFileSync(filepath, '</body>')
//   }
// }

module.exports = {
  addStyles,
}

function addStyles (content) {
  let page = ''

  page += '<head>'

  for (const style of styles) {
    page += `<link href="/home/ubuntu/dev/ashen-backup-tools/tools/prettify-backup/stylesheets/${style}" type="text/css" rel="stylesheet">`
  }

  page += '</head><body>'

  page += content

  page += '</body>'

  return page
}
