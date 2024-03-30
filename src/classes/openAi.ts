import OpenAi, { OpenAI } from 'openai'
import * as dotenv from 'dotenv'
dotenv.config()
import * as fs from 'fs'
import { getGptRoles } from '../getGptRoles'

class Ai {
  private readonly openai: OpenAI
  constructor(apiKey: string) {
    this.openai = new OpenAi({
      apiKey,
    })
  }

  async promptToTrainer(text: string) {
    const chatCompletion = await this.openai.chat.completions.create({
      messages: [{ role: 'user', content: `${getGptRoles('englishTrainer')} ${text}` }],
      model: 'gpt-3.5-turbo',
    })
    return chatCompletion.choices[0].message.content
  }

  async promptToExplainWord(text: string) {
    const chatCompletion = await this.openai.chat.completions.create({
      messages: [{ role: 'user', content: `${getGptRoles('newWord')} ${text}` }],
      model: 'gpt-3.5-turbo',
    })
    return chatCompletion.choices[0].message.content
  }

  async translate(path: string) {
    try {
      const transcription = await this.openai.audio.transcriptions.create({
        file: fs.createReadStream(path),
        model: 'whisper-1',
      })
      return transcription.text
    } catch (error) {
      console.log('error whilte translate:', error)
    }
  }
}
export const ai = new Ai(process.env.OPENAI_KEY || '')
