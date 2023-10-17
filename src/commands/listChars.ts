import { Client, Message } from 'discord.js'
// import { Character, User } from '../db/models'
// import { Character } from '../db/models/characters'

import { User } from '../db/models/user'

export async function run(client: Client, message: Message, args: string[]) {
  const user = await User.findOne({ where: { name: message.author.username } })
  const characters = await user?.getCharacters()

  if (characters!.length === 0) {
    message.channel.send(
      'No tienes personajes creados. usa el comando !createcharacter para crear uno.'
    )
    return
  }

  let msg = `# Lista de personajes de ${message.author.username} \n\n`

  characters!.map((character, index) => {
    msg += `${index + 1}-> **${character.name
      ?.charAt(0)
      .toUpperCase()}${character.name?.slice(1)}**. \n`
  })

  await message.channel.send(msg)
}

export const help = {
  name: 'characterslist',
  descripcion: 'muestra la lista de personajes que pertenecen a un jugador',
  usage: '!characterslist',
}
