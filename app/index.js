import clock from "clock"
import * as document from "document"
import { battery } from "power"
import { HeartRateSensor } from "heart-rate"
import { me as appbit } from "appbit"
import { today, goals } from "user-activity"
import { preferences } from "user-settings"


// Sensors
const heartRate = new HeartRateSensor()
let currentHeartRate = 0
heartRate.addEventListener("reading", () => {
  currentHeartRate = heartRate.heartRate
})
heartRate.start()

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

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  // Clock face
  let dateToday = evt.date
  let hours = dateToday.getHours()
  let mins = zeroPad(dateToday.getMinutes())
  let clockPrefix = ''
  
  // 午前・午後
  if (preferences.clockDisplay == '12h') {
    if (hours > 12) {
      clockPrefix = '午後'
    } else {
      clockPrefix = '午前'
    }
    hours = hours % 12 || 12
  } else {
    hours = zeroPad(hours)
  }
  clockText.text = `${hours}:${mins}`
  clockPrefixText.text = clockPrefix

  // Seconds
  let seconds = zeroPad(dateToday.getSeconds())
  secondsText.text = `${seconds}`

  // Date
  const jpWeekday = ['日', '月', '火', '水', '木', '金', '土']
  const yearDifference = -118
  let jpYearPrefix = '令'
  let jpYear = dateToday.getYear() + yearDifference
  let month = dateToday.getMonth() + 1
  let date = zeroPad(dateToday.getDate())
  let weekday = jpWeekday[dateToday.getDay()]
  dateText.text = `${jpYearPrefix}${jpYear}年${month}月${date}日 (${weekday})`

  // Battery
  let currentBatteryLevel = Math.floor(battery.chargeLevel)
  let batteryLevel = `${currentBatteryLevel}%`

  let batteryImageFile = `battery-${Math.floor(currentBatteryLevel/10)*10}.png`
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
  const completedColor = "#78B75A"

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
      stepsText.style.fill = completedColor
    }

    // Stairs
    stairsText.text = currentStairs
    if (currentStairs >= goals.elevationGain) {
      stairsText.text = completed + stairsText.text
      stairsText.style.fill = completedColor
    }

    // Calories
    caloriesText.text = currentCalories
    if (currentCalories >= goals.calories) {
      caloriesText.text = completed + caloriesText.text
      caloriesText.style.fill = completedColor
    }

    // Zone
    zoneText.text = currentZone
    if (currentZone >= goals.activeZoneMinutes.total) {
      zoneText.text = completed + zoneText.text
      zoneText.style.fill = completedColor
    }

    // Distance
    distanceText.text = parseFloat(Math.round(currentDistance) / 1000).toFixed(2)
    if (currentDistance >= goals.distance) {
      distanceText.text = completed + distanceText.text
      distanceText.style.fill = completedColor
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