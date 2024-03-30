import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import * as dotenv from 'dotenv'
dotenv.config()

const bot = new Telegraf(process.env.TELEGRAM_TOKEN || '')

bot.on(message('voice'), async (ctx) => {
  await ctx.reply('nice voice, man')
})

bot.command('start', async (ctx) => {
  await ctx.reply('hello')
})

console.log('app running')

bot.launch()
