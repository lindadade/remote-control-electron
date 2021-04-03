const FFI = require('ffi-napi')
const user32 = new FFI.Library('user32', {
  'FindWindowA': ['int32', ['string', 'string']],
  'ShowWindow': ['int32', ['int32', 'int32']]
})

function showWeChat() {
  let res = user32.FindWindowA("WeChatMainWindForPc", null)
  let show = user32.ShowWindow(res, 5)
}
module.exports = {showWeChat}
