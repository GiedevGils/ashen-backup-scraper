const fs = require('fs')
const fetch = require('node-fetch')

const stylesheets = [
  { name: 'style.css', url: 'https://resources.enjin.com/1465083538/themes/core/js/library/markitup/skins/enjin/style.css' },
  { name: 'forum.css', url: 'https://resources.enjin.com/1472503292/themes/core/css/forum.css' },
  { name: 'core.css', url: 'https://theashenchapter.enjin.com/assets/1512853484/themes/core/css/core.css' },
  { name: 'styles.css', url: 'https://resources.enjin.com/1511306023/themes/core/css/styles.css' },
  { name: 'default_fonts.css', url: 'https://theashenchapter.enjin.com/assets/1663667141/merged/default_fonts.css' },
  { name: 'theme.css', url: 'https://theashenchapter.enjin.com/assets/202209200545/themes/core/css/theme.php?site_id=275477&tag_ts=1664041263&cache=202209200545-1531954876&theme=779603' },
]

stylesheets.forEach(async sheet => {
  const res = await fetch(sheet.url)

  fs.writeFileSync(`tools/header-duplication/stylesheets/${sheet.name}`, await res.text())
})
