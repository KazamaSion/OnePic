import app from 'app'
import BWindow from 'browser-window'

var window

app.on('window-all-closed', ()=>{
  if (process.platform != 'darwin') {
    app.quit()
  }
})

app.on('ready', ()=>{
  window = new BWindow({
    width: 900,
    height: 700
  })

  window.loadUrl(`file://${__dirname}/index.html`)

  window.on('closed', ()=> window = null)
})
