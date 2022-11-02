const parseString = string => decodeURIComponent(string).split('(')[0].trim()

module.exports = {
  parseString,
}
