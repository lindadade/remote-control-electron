const WebSocket = require('ws')
const EventEmitter = require('events')
const signal = new EventEmitter()
// const path = require('path')
// const { exec } = require('child_process');
//
// function start () {
//   const filePath = path.resolve(__dirname, './signal/index.js')
//   const openExec = exec(`node ${filePath}`, function (error, stdout, stderr) {
//     if (error) {
//       console.log(error.stack);
//       console.log('Error code: ' + error.code);
//       return;
//     }
//     console.log('使用exec方法输出: ' + stdout);
//     console.log(`stderr: ${stderr}`);
//     console.log(process.pid)
//   });
//   return openExec
// }
//
// start()

const ws = new WebSocket('ws://111.231.59.178:8010')

ws.on('open', () => {
  console.log('connect success')
})

ws.on('message', function (message) {
  let data
  try {
    data = JSON.parse(message)
  } catch (e) {
    console.log('parse error', e)
  }
  signal.emit(data.event, data.data)
})

function send(event, data) {
  ws.send(JSON.stringify({event, data}))
}

function invoke(event, data, answerEvent) {
  return new Promise(((resolve, reject) => {
    send(event, data)
    signal.once(answerEvent, resolve)
    setTimeout(() => {
      reject('timeout')
    }, 5000)
  }))
}

signal.send = send
signal.invoke = invoke

module.exports = signal
