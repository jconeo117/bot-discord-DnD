import { Client, EmbedBuilder, Message } from 'discord.js'
// import { Character, User } from '../db/models'

import { Character } from '../db/models/characters'
import { User } from '../db/models/user'

export async function run(client:Client, message:Message, args:string[]) {

  const user = await User.findOne({where:{name:message.author.username}})
  const characters = await Character.findAll({ where: { userId: user?.id } })

  if (characters.length === 0) {
    message.channel.send(
      'No tienes personajes creados. usa el comando !createcharacter para crear uno.'
    )
    return
  }

  const fields = characters.map((character, index) => ({
    name: " ",
    value: `**${index +1}**. ${character.name}`,
  }));

  const embed = new EmbedBuilder()
    .setColor('Red')
    .setTitle(`Listado de personajes de ${message.author.username}`)
    .addFields(fields)
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

    if(message.channel.type === 0){
      await message.channel.send({ embeds: [embed] })

    }else if(message.channel.type ===1){
      let msg = `# Lista de personajes de ${message.author.username} \n\n`

      characters.map((character, index)=>{
        msg += `${index+1}-> **${character.name?.charAt(0).toUpperCase()}${character.name?.slice(1)}**. \n`
      })

      await message.channel.send(msg)
    }
}

export const help = {
  name: 'characterslist',
  descripcion: 'muestra la lista de personajes que pertenecen a un jugador',
  usage: '!characterslist',
}
