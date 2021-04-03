if(process.platform === 'darwin') {
    console.log(process.platform)
    require('./darwin.js')
} else if (process.platform === 'win32') {
    require('./win32.js')
} else {
  // 不处理
}
