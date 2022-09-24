const fs = require('fs')
const { parse } = require('node-html-parser')

module.exports = {
  generate,
}

const core = '<html></html>'

generate()

function generate () {
  const html = parse(core)
  const tree = JSON.parse(fs.readFileSync('./tools/tree-view/result.json'))

  const head = parse('<head><title>TACH forum tree</title><style src="tools/tree-view/style.css" /></head>')
  const body = parse('<body>')

  for (const item of tree) {
    console.log(item.name)
    const element = parse(`
    <li>
      <a href="${item.url}">${item.name}</a>
    </li>
    `)

    html.appendChild(element)
  }

  html.appendChild(head)
  html.appendChild(body)

  fs.writeFileSync('tools/tree-view/tach-forum-tree.html', html.toString())
}
