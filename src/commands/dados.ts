// commands/dados.js

import { Client, EmbedBuilder, Message } from 'discord.js'
import { getRandomNum } from '../utils/diceRandom'

export async function run(client: Client, message: Message, args: string[]) {
  
  const diceCountStr = args[0]
  const diceFacesStr = args[1] || '6' // Si no se proporciona un número de caras, asume 6.

  const diceCount = Number(diceCountStr) // Convierte a número
  const diceFaces = Number(diceFacesStr) // Convierte a número

  if (isNaN(diceCount) || isNaN(diceFaces) || !diceCountStr || !diceFacesStr) {
    message.reply(`Uso: ${help.usage}`)
    return
  }

  if (diceCount > 10) {
    message.channel.send(
      'Eche tu que eres marica pa andar tirando más de 10 dados cachon malparido'
    )
    setTimeout(() => {
      message.channel.send('Come monda perro hpta')
    }, 800)
    return
  }

  const embed = new EmbedBuilder()
    .setColor('Red')
    .setTitle(
      `${message.author.username} tira ${diceCount} dado(s) de ${diceFaces} caras`
    )
    .setTimestamp()
    .setAuthor({
      name: message.author.username,
      iconURL: message.author.avatarURL() || message.author.displayAvatarURL(),
    })
    .setFooter({
      text: 'Mamaguevo Inc.',
      iconURL:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAqwjdp8e_fM1Q30pyyvGVeFjBBc5rFnsvsfAKTPIdCAQWI0m1wv80PhXfWJiwkONe79A&usqp=CAU',
    })

  const msgReply = await message.channel.send({ embeds: [embed] })
  message.delete()

  let dicesArray = Array(diceCount).fill(0)
  let descriptionStr = ''
  let dicesArrayIndex = 0

  const interval = setInterval(() => {
    dicesArray[dicesArrayIndex] = getRandomNum(1, diceFaces)
    descriptionStr += `🎲: ${dicesArray[dicesArrayIndex]}\n`
    dicesArrayIndex++

    if (dicesArrayIndex >= dicesArray.length) {
      clearInterval(interval)
      const total = dicesArray.reduce((prev, curr) => prev + curr)
      descriptionStr += `\nTotal: **${total}**`
    }
    embed.setDescription(descriptionStr)
    msgReply.edit({ embeds: [embed] })
  }, diceCount * 100)
}

export const help = {
  name: 'dados',
  description: 'Tira un dado o múltiples dados.',
  usage: '!dados [cantidad de dados] <numero de caras>',
}
