import * as messaging from "messaging"
import { settingsStorage } from "settings"

export function initialize() {
  // If the settings have been changed, send the value via sendValue()
  // settingsStorage.addEventListener("change", event => {
  //   // console.log('Settings changed!', event)
  //   if (event.oldValue !== event.newValue) {
  //     sendValue(event.key, event.newValue)
  //   }
  // })
}

// Send it to the app, if a connection is open
function sendSettingData(data) {
  // if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
  //   messaging.peerSocket.send(data)
  // } else {
  //   console.log("No peerSocket connection")
  // }
}

// Organize the key-value pair and send it
function sendValue(key, value) {
  // if (value) {
  //   sendSettingData({
  //     key: key,
  //     value: JSON.parse(value)
  //   })
  // }
}