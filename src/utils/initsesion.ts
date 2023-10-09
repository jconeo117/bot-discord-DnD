import { EmbedBuilder, Message } from 'discord.js'
import { Session } from '../db/models/sessions'
// import { User } from '../db/models/Users'
import { User } from '../db/models/user'

export const initsesion = async (
  embed: EmbedBuilder,
  message: Message,
  description: string,
  sessionName: string,
  gameMaster: User | null
) => {
  try {
    var sesion = await Session.create({
      name: sessionName,
    })

    sesion.setGameMaster(gameMaster?.id)
    description += `Game master: **${gameMaster?.name}** \n
    jugadores en la sesion: \n`

    embed
      .setTitle(sesion.name)
      .setColor('Red')
      .setDescription(description)
      .setAuthor({
        name: gameMaster?.name as string,
        iconURL:
          message.author.avatarURL() || message.author.displayAvatarURL(),
      })
      .setFooter({
        text: 'Mamaguevo Inc.',
        iconURL:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAqwjdp8e_fM1Q30pyyvGVeFjBBc5rFnsvsfAKTPIdCAQWI0m1wv80PhXfWJiwkONe79A&usqp=CAU',
      })

      const reply = await message.channel.send({
        content: `La sesion **${sesion.name}** ha sido creada con Exito`,
        embeds: [embed],
      })

      return {reply, description}
  } catch (error) {
    console.log(error)
  }
}
