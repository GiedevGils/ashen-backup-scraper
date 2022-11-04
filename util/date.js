const { parse, previousMonday, previousTuesday, previousWednesday, previousThursday, previousFriday, previousSaturday, previousSunday } = require('date-fns')

const lastDayFunctions = {
  Mon: previousMonday,
  Tue: previousTuesday,
  Wed: previousWednesday,
  Thu: previousThursday,
  Fri: previousFriday,
  Sat: previousSaturday,
  Sun: previousSunday,
}

const formatEnjinDateToDateObject = dateString => {
  let toReturn

  const splits = dateString.split(' ')

  toReturn = parse(`${splits[1]} ${splits[2]} ${splits[3]}`, 'MMM d, yy', new Date())

  try {
    toReturn.toISOString()
  } catch (e) {
    if (e.message.toLowerCase().includes('invalid time')) {
      const day = splits[1]

      toReturn = getLastX(day)

      const [hours, minutes] = splits[3].split(':')

      toReturn.setHours(hours)
      toReturn.setMinutes(minutes)
      toReturn.setSeconds(0)

      try {
        toReturn.toISOString()
      } catch (e) {
        console.log(e)
        throw e
      }
    } else {
      throw e
    }
  }

  return toReturn
}

/**
 * @param {string} day
 * @returns {Date}
 */
function getLastX (day) {
  return lastDayFunctions[day](new Date())
}

module.exports = {
  formatEnjinDateToDateObject,
}
