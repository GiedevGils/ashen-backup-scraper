const fs = require('fs')
const fetch = require('node-fetch')

const stylesheets = [
  'https://resources.enjin.com/1465083538/themes/core/js/library/markitup/skins/enjin/style.css',
  'https://resources.enjin.com/1472503292/themes/core/css/forum.css',
  'https://theashenchapter.enjin.com/assets/1512853484/themes/core/css/core.css',
  'https://resources.enjin.com/1511306023/themes/core/css/styles.css',
  'https://theashenchapter.enjin.com/assets/1663667141/merged/default_fonts.css',
  'https://theashenchapter.enjin.com/assets/202209200545/themes/core/css/theme.php?site_id=275477&amp;tag_ts=1664040065&amp;cache=202209200545-1531954876&amp;theme=779603',
]

stylesheets.forEach(async url => {
  const res = await fetch(url)
  const sheetname = url.split('/').at(-1)

  fs.writeFileSync(`tools/header-duplication/stylesheets/${sheetname}`, await res.text())
})
