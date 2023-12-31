import { Client, EmbedBuilder, Message } from 'discord.js'
// import { Character, User } from '../db/models'

import { Character } from '../db/models/characters'
import { User } from '../db/models/user'

export async function run(client: Client, message: Message, args: string[]) {
  //verificar que se haya proporcionado al menos el nombre del personaje
  if (!args[0] || args[0].trim() === '') {
    message.reply(`Uso: ${help.usage}`)
    return
  }

  const nombre = args.join(' ')

  const user = await User.findOne({ where: { name: message.author.username } })
  const character = await Character.findOne({
    where: { name: nombre, userId: user?.id },
  })

  if (!character) {
    message.channel.send(`No se encontró un personaje con el nombre ${nombre}`)
    return
  }

  const text = `
      ## Estadisticas de ${character.name}:

      - **Iniciativa**: +${character.iniciativa}
      - **Defensa Melee**: ${character['Defensa Melee']}
      - **Ataque Melee**: +${character['Ataque Melee']}
      - **Daño Melee**: ${character['Daño Melee']}
      - **Defensa Distancia**: ${character['Defensa Distancia']}
      - **Ataque Distancia**: +${character['Ataque Distancia']}
      - **Daño Distancia**: ${character['Daño Distancia']}
      - **Absorción**: +${character.absorcion}
      - **Puntos de Vida**: ${character['Puntos Vitales']}
      - **Control de Ki, base**: +${character['Control de ki']}
      - **Puntos de Ki, base**: ${character['Puntos Vitales']}
      - **Puntos de caracteristica**: ${character['Puntos de caracteristica']}
      `

  await message.channel.send(text)
}

export const help = {
  name: 'character',
  descripcion: 'ver las estadisticas de un personaje',
  usage: '!character [nombre]',
}
