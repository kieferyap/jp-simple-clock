import clock from "clock"
import * as document from "document"
import { battery } from "power"
import { HeartRateSensor } from "heart-rate"
import { me as appbit } from "appbit"
import { today, goals } from "user-activity"
import { preferences } from "user-settings"
import { memory } from "system"

// Sensors
let clockEvent = null
const heartRate = new HeartRateSensor()
let currentHeartRate = 0
heartRate.addEventListener("reading", () => {
  currentHeartRate = heartRate.heartRate
})
heartRate.start()

// Settings
const DATE_SETTING_EYMD = 0
const DATE_SETTING_EMDY = 1
const DATE_SETTING_EY_JMD = 2
const DATE_SETTING_JYMD = 3
const DATE_SETTING_EMD = 4
const DATE_SETTING_MAX = 4
let dateFormatSetting = DATE_SETTING_JYMD

const TIME_SETTING_HMS = 0
const TIME_SETTING_MAX = 1
let timeFormatSetting = TIME_SETTING_HMS

// Zero padding
const zeroPad = input => ('0' + input).slice(-2)

// Update the clock every second
clock.granularity = "seconds"

// Get a handle on the <text> element
const clockPrefixText = document.getElementById("clock-prefix")
const clockText = document.getElementById("hour-minute")
const secondsText = document.getElementById("seconds")
const dateText = document.getElementById("jp-date")
const batteryText = document.getElementById('battery-level')
const heartRateText = document.getElementById('heart-rate')
const stepsText = document.getElementById('steps')
const stairsText = document.getElementById('stairs')
const caloriesText = document.getElementById('calories')
const zoneText = document.getElementById('zone')
const distanceText = document.getElementById('distance')
const batteryImage = document.getElementById('battery-image')

// Clock text: On click, toggle settings
clockText.addEventListener("click", (event) => {
  timeFormatSetting += 1
  if (timeFormatSetting > TIME_SETTING_MAX) {
    timeFormatSetting = 0
  }
  updateClock()
})

// Date text: On click, toggle settings
dateText.addEventListener("click", (event) => {
  dateFormatSetting += 1
  if (dateFormatSetting > DATE_SETTING_MAX) {
    dateFormatSetting = 0
  }
  updateClock()
})

function updateClock(evt = null) {
  // console.log("JS memory: " + memory.js.used + "/" + memory.js.total);

  // Clock face
  if (evt) { 
    clockEvent = evt
  }
  let dateToday = clockEvent.date
  let hours = dateToday.getHours()
  let mins = zeroPad(dateToday.getMinutes())
  let clockPrefix = ''

  // 午前・午後
  if (preferences.clockDisplay == '12h') {
    if (hours > 12) {
      clockPrefix = 'PM'
    } else {
      clockPrefix = 'AM'
    }
    hours = hours % 12 || 12
  } else {
    hours = zeroPad(hours)
  }
  clockText.text = `${hours}:${mins}`
  clockPrefixText.text = clockPrefix

  // Seconds
  if (timeFormatSetting == TIME_SETTING_HMS) {
    let seconds = zeroPad(dateToday.getSeconds())
    secondsText.text = `${seconds}`
  } else {
    secondsText.text = ''
  }

  // Date
  const enWeekdayArray = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const jpWeekdayArray = ['日', '月', '火', '水', '木', '金', '土']

  const jpYearDifference = -118
  const enYearDifference = 1900
  let jpYearPrefix = '令'
  let jpYear = dateToday.getYear() + jpYearDifference
  let enYear = dateToday.getYear() + enYearDifference
  let month = dateToday.getMonth() + 1
  let date = zeroPad(dateToday.getDate())
  let jpWeekday = jpWeekdayArray[dateToday.getDay()]
  let enWeekday = enWeekdayArray[dateToday.getDay()]

  switch (dateFormatSetting) {
    case DATE_SETTING_JYMD:
      dateText.text = `${jpYearPrefix}${jpYear}年${month}月${date}日 (${jpWeekday})`
      break
    case DATE_SETTING_EY_JMD:
      dateText.text = `${enYear}年${month}月${date}日 (${jpWeekday})`
      break
    case DATE_SETTING_EYMD:
      dateText.text = `${enYear}-${zeroPad(month)}-${date} (${enWeekday})`
      break
    case DATE_SETTING_EMDY:
      dateText.text = `${zeroPad(month)}-${date}-${enYear} (${enWeekday})`
      break
    case DATE_SETTING_EMD:
      dateText.text = `${zeroPad(month)}-${date} (${enWeekday})`
      break
  }

  // Battery
  let currentBatteryLevel = Math.floor(battery.chargeLevel)
  let batteryLevel = `${currentBatteryLevel}%`

  let batteryImageFile = `battery-${Math.floor(currentBatteryLevel / 10) * 10}.png`
  if (currentBatteryLevel < 20) {
    batteryText.style.fill = "red"
  }
  else {
    batteryText.style.fill = "#BBBBBB"
  }
  if (battery.charging) {
    batteryImageFile = 'battery-charging.png'
    batteryText.style.fill = "#72E3F1"
  }

  batteryText.text = batteryLevel
  batteryImage.href = batteryImageFile

  const completed = ''
  // const completedColor = "#78B75A"

  // Heart rate
  heartRateText.text = currentHeartRate

  if (appbit.permissions.granted("access_activity")) {
    const currentSteps = today.adjusted.steps
    const currentStairs = today.adjusted.elevationGain
    const currentCalories = today.adjusted.calories
    const currentZone = today.adjusted.activeZoneMinutes.total
    const currentDistance = today.adjusted.distance

    // Steps
    stepsText.text = currentSteps
    if (currentSteps >= goals.steps) {
      stepsText.text = completed + stepsText.text
      stepsText.style.fill = '#a29bfe'
    } else {
      stepsText.style.fill = '#BBBBBB'
    }

    // Stairs
    stairsText.text = currentStairs
    if (currentStairs >= goals.elevationGain) {
      stairsText.text = completed + stairsText.text
      stairsText.style.fill = '#81ecec'
    } else {
      stairsText.style.fill = '#BBBBBB'
    }

    // Calories
    caloriesText.text = currentCalories
    if (currentCalories >= goals.calories) {
      caloriesText.text = completed + caloriesText.text
      caloriesText.style.fill = '#e67e22'
    } else {
      caloriesText.style.fill = '#BBBBBB'
    }

    // Zone
    zoneText.text = currentZone
    if (currentZone >= goals.activeZoneMinutes.total) {
      zoneText.text = completed + zoneText.text
      zoneText.style.fill = '#f1c40f'
    } else {
      zoneText.style.fill = '#BBBBBB'
    }

    // Distance
    distanceText.text = parseFloat(Math.round(currentDistance) / 1000).toFixed(2)
    if (currentDistance >= goals.distance) {
      distanceText.text = completed + distanceText.text
      distanceText.style.fill = '#74b9ff'
    } else {
      distanceText.style.fill = '#BBBBBB'
    }
  }
  else {
    // Steps
    stepsText.text = `許可必要`

    // Stairs
    stairsText.text = `Permission`

    // Calories
    caloriesText.text = `required`

    // Zone
    zoneText.text = `Check`

    // Distance
    distanceText.text = `app`
  }
}

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  updateClock(evt)
}