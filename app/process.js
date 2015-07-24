import Bluebird from 'bluebird'
import cp from 'child_process'
Bluebird.promisifyAll(cp)
import path from 'path'
import os from 'os'
import uuid from 'uuid'
import {render} from 'mustache'
import fs from 'fs-extra'
Bluebird.promisifyAll(fs)
var tmpl = fs.readFileSync(__dirname + '/encode.avs', 'utf8')

function getAudioLen(path, libDir) {
  var cmd = `ffprobe -select_streams a:0 -show_entries stream=duration -of default=noprint_wrappers=1:nokey=1 -v quiet "${path}"`
  return cp.execAsync(cmd, {
    cwd: libDir
  })
}

export default async function({audioSource, imageSource, idr, imageSizes, target, crop}) {
  var libDir = path.resolve(__dirname, '../bin/video')


  var tempPathBase = path.join(os.tmpdir(), 'tmpOnePicEnc' + uuid.v1())

  var tmpAvsPath = tempPathBase + '.avs'
  var tmpVideoPath = tempPathBase +'.mp4'

  var tmpImgPath = tempPathBase + path.extname(imageSource)

  await Bluebird.fromNode(callback => {  var gm = require('gm') 
  
  
  gm(imageSource).resize(})
  
  

  
  await fs.copyAsync(imageSource, tmpImgPath)

  var audioLen = parseInt(await getAudioLen(audioSource, libDir), 10)
  var tmpAvs = render(tmpl, {
    soraPath: path.join(libDir, 'sorathread.dll'),
    imagePath: tmpImgPath,
    numFrames: audioLen + 1,
    height: imageSizes.height === 0 ? 'last.height()' : `"${imageSizes.height}"`,
    width: imageSizes.width === 0 ? 'last.width()' : `"${imageSizes.width}"`,
    crop
  })

  await fs.writeFileAsync(tmpAvsPath, tmpAvs)

  var x264Arg = [
    "avs4x264mod --x264-binary x264_64_tMod-8bit-all",
    "--fps 1 --opt 1 --crf 28 --level 4.1 --ref 9 --b-adapt 1 --bframes 16 ",
    `--keyint ${idr} --min-keyint 1 --direct auto`,
    "--me dia --merange 4 --subme 0 -t 2 --partitions all --acodec none",
    `--output "${tmpVideoPath}" "${tmpAvsPath}"`
  ].join(' ')

  await Bluebird.fromNode(function(callback) {
    var child = cp.exec(x264Arg, {cwd: libDir}, callback)
    child.stdout.pipe(process.stdout)
    child.stderr.pipe(process.stderr)
  })

  var remuxerArg = `remuxer -i "${tmpVideoPath}" -i "${audioSource}" -o "${target}"`

  console.log(await cp.execAsync(remuxerArg, {cwd: libDir}))

  fs.unlink(tmpAvsPath)
  fs.unlink(tmpVideoPath)
  fs.unlink(tmpImgPath)
}
