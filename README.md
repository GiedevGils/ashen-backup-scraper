back up scraper for https://theashenchapter.enjin.com


due to enjin being extremely sketchy as of late, this script will back up pages of threads in bulk. it writes these out to my file system so that I can later format them for a potential new forum.

it works by:
1. checking [`input/pages.js`](input/pages.js) for threads to save.
2. creating a directory for the thread
3. looping over all web-pages (10 posts per) in that thread (hard-coded in `pages.js`)
    1. check if this page has already been scraped before
        1. if yes, skip
        2. if no, scrape
        3. if it is the final page of the thread, re-scrape, as new posts might have been added
    2. it gets the webpage
    3. it isolates the thread itself, to avoid headers, footers, and sidebars also being saved
    4. it saves that to the filesystem
