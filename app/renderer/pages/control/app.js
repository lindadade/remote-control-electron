const peer = require('./peer-control')

peer.on('add-stream', (stream) => {
  play(stream)
})

let video = document.getElementById('screen-video')
function play(stream) {
  video.srcObject = stream
  video.onloadedmetadata = function () {
    video.play()
  }
}

window.onkeydown = function (e) {
  let data = {}
  peer.emit('robot', data)
  data = {
    keyCode: e.keyCode,
    shift: e.shiftKey,
    meta: e.metaKey,
    control: e.ctrlKey,
    alt: e.altKey,
  }
  peer.emit('robot', 'key', data)
}

window.onmouseup = function (e) {
  let data = {}
  data.clientX = e.clientX
  data.clientY = e.clientY
  data.video = {
    width: video.getBoundingClientRect().width,
    height: video.getBoundingClientRect().height
  }
  peer.emit('robot', 'mouse', data)
}
