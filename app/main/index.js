const {app} = require('electron')
const isDev = require('electron-is-dev')
const handleIPC = require('./ipc')

const {create: createMainWindow, show: showMainWindow, close: closeMainWindow} = require('./windows/main')
// const {create: createControlWindow} = require('./windows/control')
const gotTheLock = app.requestSingleInstanceLock()  // 是否有别的进程了
if(require('electron-squirrel-startup')) app.quit()
if(!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    showMainWindow()
  })
  app.on('will-finish-launching', () => {
    if(!isDev) {
      require('./updater.js')
    }
    require('./crash-reporter').init()
  })
  app.on('ready', () => {
    // createControlWindow()
    // 指纹接入 -> 集成C++能力
    app.fp = require('geektime-fringerprint-example').getFringerprint()
    // console.log(app.fp)
    createMainWindow()
    handleIPC()
    require('./trayAndMenu')
    require('./robot.js')()
  })
  app.on('activate', () => {
    showMainWindow()
  })
  app.on('before-quit', () => {
    closeMainWindow()
  })
}
