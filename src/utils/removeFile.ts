import { unlink } from 'fs/promises'

export const removeFile = async (path: string) => {
  try {
    await unlink(path)
  } catch (e) {
    console.log('error while removing')
  }
}
