import Vue from 'vue'
import validator from 'vue-validator'
import process from './process.js'
import {queue} from 'async'
import path from 'path'
import remote from 'remote'

Vue.use(validator)

var q = queue(function (task, callback) {
  process(task)
  .then(r => callback(null))
  .catch(function (err) {
    console.log(err.message)
    callback(err)
  })
})

var App = new Vue({
  el: '#main',
  data: {
    idr: 150,
    idrOne: false,
    height: 0,
    width: 0,
    reset: true,
    format: 'mp4',
    queue: [],
    image: null,
    audio: null,
    crop: {
      l: 0, r: 0, b: 0, t: 0
    }
  },
  methods: {
    onOver(e){
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    startProcess(audioSource, imageSource){
      var idr = parseInt(this.idr, 10)
      var p = path.parse(audioSource)
      var target = path.join(p.dir, `${p.name}.OnePic.${this.format}`)

      this.queue.push({
        status: 'pending',
        target,
        audioSource
      })



      q.push({
        audioSource,
        imageSource,
        imageSizes: {
          width: parseInt(this.width, 10),
          height: parseInt(this.height, 10)
        },
        idr: this.idrOne ? 'infinite' : idr + Number(idr === 0),
        target,
        crop: this.crop
      }, err => {
        var status = err ? 'error' : 'success'
        this.queue = this.queue.map(obj => {
          if (obj.audioSource == audioSource) {
            obj.status = status
          }
          return obj
        })

        setTimeout(() => {
          this.queue = this.queue.filter(obj => {
            if (obj.audioSource == audioSource) {
              return false
            }
            return true
          })
        }, 7000) // Remove after 7 sec
      })
      if (this.reset) {
        this.width = 0
        this.height = 0
        this.crop = {l: 0, r: 0, b: 0, t: 0}
      }
    },
    onDrop(e){
      e.stopPropagation()
      e.preventDefault()

      if (this.invalid) {
        return
      }

      var files = Array.from(e.dataTransfer.files)

      files.forEach(f => {
        if (f.type.startsWith('image')) {
          this.image = f.path
        }
        if (f.type === 'audio/x-m4a') {
          this.audio = f.path
        }
      });

      if (this.audio && this.image) {
        this.startProcess(this.audio, this.image)
        this.audio = null
        this.image = null
      }
    }
  }
})

window.addEventListener('drop', e => {
  e.stopPropagation()
  e.preventDefault()
})

document.addEventListener('scroll', e => {
  window.scrollTo(0,0)
})
