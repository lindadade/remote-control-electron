const applescript = require('applescript')
const script = 'tell application "WeChat" to activate end'
applescript.execString(script, (err, res) => {
  if (err) {
    console.log(err)
    return
  }
  console.log(res)
})
