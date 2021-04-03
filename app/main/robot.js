const { ipcMain } = require('electron')
const robot = require('robotjs')
const vkey = require('vkey')

function handleMouse(data) {
  let {clientX, clientY, screen, video} = data
  let x = clientX * screen.width / video.width
  let y = clientY * screen.height / video.height
  robot.moveMouse(x, y)
  robot.mouseClick()
}

function handleKey(data) {
  const modifiers = []
  data.meta && modifiers.push('meta')
  data.shift && modifiers.push('shift')
  data.alt && modifiers.push('alt')
  data.ctrl && modifiers.push('ctrl')
  const key = vkey[data.keyCode].toLowerCase()
  if (key[0] != '<') {
    robot.keyTap(key, modifiers)
  }
}

module.exports = function () {
  ipcMain.on('robot', (e, type, data) => {
    if (type === 'mouse') {
      handleMouse(data)
    } else if (type === 'key') {
      handleKey(data)
    }
  })
}
