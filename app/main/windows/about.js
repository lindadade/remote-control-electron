const openAboutWindow = require('about-window').default
const path = require('path')

const create = () => openAboutWindow({
  icon_path: path.join(__dirname, 'icon.png'),
  package_json_dir: path.resolve(__dirname, '/../../../'),
  cropyright: 'Copyright (c) 2021 dragon',
  homepage: 'https://gitee.com/lin_daren/remote-control-electron-lindada',
})

module.exports = {create}
