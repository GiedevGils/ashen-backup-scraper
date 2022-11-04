const { parse, previousMonday, previousTuesday, previousWednesday, previousThursday, previousFriday, previousSaturday, previousSunday, subHours } = require('date-fns')

const lastDayFunctions = {
  Mon: previousMonday,
  Tue: previousTuesday,
  Wed: previousWednesday,
  Thu: previousThursday,
  Fri: previousFriday,
  Sat: previousSaturday,
  Sun: previousSunday,
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const days = Object.keys(lastDayFunctions)

const formatEnjinDateToDateObject = dateString => {
  let toReturn

  const splits = removeLinebreaks(dateString).split(' ')
  const dayMonthOrHour = splits[1]
  const potentialHours = splits[2]

  if (months.includes(dayMonthOrHour)) {
    toReturn = parse(`${splits[1]} ${splits[2]} ${splits[3]}`, 'MMM d, yy', new Date())
  }

  if (days.includes(dayMonthOrHour)) {
    toReturn = getLastX(dayMonthOrHour)
    const [hours, minutes] = splits[3].split(':')

    toReturn.setHours(hours)
    toReturn.setMinutes(minutes)
    toReturn.setSeconds(0)
  }

  if (potentialHours.includes('hours')) {
    toReturn = subHours(new Date(), dayMonthOrHour)
    toReturn.setSeconds(0)
  }

  try {
    toReturn.toISOString()
  } catch (e) {
    console.error(e.message)
    return undefined
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

/**
 * @param {string} string
 * @returns {string}
 */
function removeLinebreaks (string) {
  return string.replaceAll('\n', '').trim()
}

module.exports = {
  formatEnjinDateToDateObject,
}
