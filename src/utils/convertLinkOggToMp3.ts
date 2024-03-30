import axios from 'axios'
import { createWriteStream } from 'fs'
import { dirname, resolve } from 'path'
import ffmpeg from 'fluent-ffmpeg'
import installer from '@ffmpeg-installer/ffmpeg'
import { removeFile } from './removeFile'

ffmpeg.setFfmpegPath(installer.path)

const oggToMp3 = (oggPath: string, fileName: string) => {
  try {
    const mp3Path = resolve(dirname(oggPath), `${fileName}.mp3`)
    return new Promise<string>((resolve) => {
      ffmpeg(oggPath)
        .inputOption('-t 30')
        .output(mp3Path)
        .on('end', () => {
          removeFile(oggPath).then(() => resolve(mp3Path))
        })
        .run()
    })
  } catch (e) {
    console.log('error whilte convert ogg to mp3')
  }
}
export const convertLinkOggToMp3 = async (url: string, fileName: string) => {
  try {
    const oggPath = resolve(__dirname, '../voices', `${fileName}.ogg`)
    const response = await axios({
      method: 'get',
      url,
      responseType: 'stream',
    })
    return new Promise<string>((resolve) => {
      const stream = createWriteStream(oggPath)
      response.data.pipe(stream)
      stream.on('finish', async () => {
        resolve((await oggToMp3(oggPath, fileName)) || '')
      })
    })
  } catch (e) {
    console.log(e)
  }
}
