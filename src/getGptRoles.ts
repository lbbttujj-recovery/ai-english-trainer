const gptRoles = {
  englishTrainer:
    'Представь что ты учитель английского языка. Скажи мне что можно исправить в этой фразе, объясни свое решение.Также отправь исправленную фразу целиком:',
  newWord: 'Расскажи что значит это слово и как его обычно использует в английском языке',
}

export const getGptRoles = (role: keyof typeof gptRoles) => {
  return gptRoles[role]
}
