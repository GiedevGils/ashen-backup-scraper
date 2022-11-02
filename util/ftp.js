const ftp = require('basic-ftp')
const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  upload,
}

async function upload (filepath, filename) {
  const client = new ftp.Client()

  try {
    await client.access({
      host: process.env.ftp_host,
      user: process.env.ftp_username,
      password: process.env.ftp_password,
      secure: false,
    })

    await client.cd('/domains/ilthy.dev/public_html/tach')

    await client.uploadFrom(filepath, filename)

    console.log(`${filename} uploaded to tach.ilthy.dev`)
  } catch (e) {
    console.log(e)
  }
  client.close()
}
