## back up scraper for https://theashenchapter.enjin.com


Due to enjin being extremely sketchy as of late, this script is a gathering of several tools to help back up the forums hosted on the above URL.

## thread backup tool
This script will back up pages of threads in bulk. it writes these out to my file system so that I can later format them for a potential new forum.

It works by:
1. Checking [`tools/.../pages.js`](./tools/backup/pages.js) for threads to save.
2. Creating a directory for the thread
3. Looping over all web-pages (10 posts per) in that thread (hard-coded in `pages.js`)
    1. Check if this page has already been scraped before
        1. If yes, skip
        2. If no, scrape
        3. If it is the final page of the thread, re-scrape, as new posts might have been added
    2. It gets the webpage
    3. It isolates the thread itself, to avoid headers, footers, and sidebars also being saved
    4. It saves that to the filesystem

## tree overview of forums and threads

todo