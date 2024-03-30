import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import * as dotenv from 'dotenv'
import { convertLinkOggToMp3 } from './utils/convertLinkOggToMp3'
import { ai } from './classes/openAi'
import { removeFile } from './utils/removeFile'
dotenv.config()

const bot = new Telegraf(process.env.TELEGRAM_TOKEN || '')

bot.on(message('text'), async (ctx) => {
  try {
    await ctx.sendChatAction('typing')

    const response = await ai.promptToExplainWord(ctx.message.text)
    if (response) {
      ctx.reply(response)
    }
  } catch (e) {
    console.log('error with word', e)
  }
})

bot.on(message('voice'), async (ctx) => {
  try {
    await ctx.sendChatAction('typing')
    const { href: oggPath } = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
    const userId = String(ctx.message.from.id)
    const mp3Path = await convertLinkOggToMp3(oggPath, userId)
    if (mp3Path) {
      const text = await ai.translate(mp3Path)
      removeFile(mp3Path)
      const trainerResponse = text && (await ai.promptToTrainer(text))
      if (trainerResponse) {
        ctx.reply(trainerResponse)
      }
    }
  } catch (error) {
    console.log('error while voice message', error)
  }
})

bot.command('start', async (ctx) => {
  await ctx.reply('hello')
})

console.log('app running')

bot.launch()
