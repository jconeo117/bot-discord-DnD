import {
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  Message,
  EmbedBuilder,
  ActionRowBuilder,
  Client,
  Interaction,
} from 'discord.js'

// import { Character, Session, User } from '../db/models'

import { Session } from '../../db/models/sessions'
import { User } from '../../db/models/user'
import { Character } from '../../db/models/characters'



export const joinsesion = async (
  client: Client,
  embed: EmbedBuilder,
  message: Message,
  characters: Character[],
  session: Session,
  user: User,
  msg?:{reply:Message<false>|Message<true>; description: string}| undefined
) => {
  const menu = new StringSelectMenuBuilder()
    .setCustomId('select_character')
    .setPlaceholder('Selecciona tu personaje')

  const options = characters.map((char, index) => {
    return new StringSelectMenuOptionBuilder()
      .setLabel(char.name as string)
      .setValue(index.toString())
  })

  menu.addOptions(options)

  await message.channel.send({
    content: 'Selecciona el personaje para la sesion',
    components: [
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu),
    ],
  })

  client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isAnySelectMenu()) return
    if (interaction.customId === 'select_character') {
      // console.log(message)
      const charSelect = characters[parseInt(interaction.values[0])]
      
      const existeUsersession = await session.hasPlayer({
        where: { userId: user.id },
      })
      
      if (existeUsersession) {
        await message.channel.send('El usuario existe en la sesion')
        return
      }
      
      
      await session.addPlayers(user.id)
      await session.addCharacters(charSelect.id)
      .then(async ()=>{
        await interaction.message.delete()
      })
      
      await interaction.reply({
        content:`Te has unido a la sesion: **${session.name}** con el personaje: **${charSelect.name}**`,
      })
      
      if(msg) msg.description += `\n -**${charSelect.name}** -> **#${user.name}**.`

      embed.setDescription(msg?.description as string)

      await msg?.reply.edit({
        embeds:[embed]
      })
      .then(async ()=>{
        await interaction.deleteReply()
      })
      
    }
  })
}
