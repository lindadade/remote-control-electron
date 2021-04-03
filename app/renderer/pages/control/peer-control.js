const EventEmitter = require('events')
const peer = new EventEmitter()
// 以下是peer-puppet的代码
const {ipcRenderer} = require('electron')

// peer.on('robot', (type, data) => {
//   if (type === 'mouse') {
//     data.screen = { width: window.screen.width, height: window.screen.height }
//   }
//   ipcRenderer.send('robot', type, data)
// })
const pc = new window.RTCPeerConnection({})

const dc = pc.createDataChannel('robochannel', {reliable: false})
dc.onopen = function () {
  peer.on('robot', (type, data) => {
    dc.send(JSON.stringify({type, data}))
  })
}
dc.onmessage = function (event) {
  console.log('message', event)
}
dc.onerror = (e) => {
  console.log('error', e)
}

// onicecandidate iceEvent
// addIceCandidate
pc.onicecandidate = function (e) {
  console.log('candidate', JSON.stringify(e.candidate))
  if (e.candidate) {
    ipcRenderer.send('forward', 'control-candidate', JSON.stringify(e.candidate))
  }
}
ipcRenderer.on('candidate', (e, candidate) => {
  addIceCandidate(candidate)
})
let candidates = []
async function addIceCandidate(candidate) {
  candidate && candidates.push(candidate)
  if (pc.remoteDescription && pc.remoteDescription.type) {
    for (let i = 0; i < candidates.length; i++) {
      await pc.addIceCandidate(new RTCIceCandidate(candidates[i]))
    }
    candidates = []
  }
}

async function createOffer() {
  const offer = await pc.createOffer({
    offerToReceiveAudio: false,
    offerToReceiveVideo: true
  })
  await pc.setLocalDescription(offer)
  console.log('pc offer', JSON.stringify(offer))
  return pc.localDescription
}
createOffer().then((offer) => {
  ipcRenderer.send('forward', 'offer', {type: offer.type, sdp: offer.sdp})
})

async function setRemote(answer) {
  await pc.setRemoteDescription(answer)
}

ipcRenderer.on('answer', (e, answer) => {
  setRemote(answer)
})

window.setRemote = setRemote
pc.onaddstream = function (e) {
  console.log('add-stream', e)
  peer.emit('add-stream', e.stream)
}
module.exports = peer
