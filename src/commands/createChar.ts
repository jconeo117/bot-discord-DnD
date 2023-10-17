import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  Client,
  Message,
  Interaction,
  AnySelectMenuInteraction,
  Events,
} from 'discord.js'
import { Character } from '../db/models/characters'
import { User } from '../db/models/user'
import { calculateDmg, calculatePoints } from '../utils/calculateDmg'

class base_stats {
  [key: string]: number | string | undefined
  name: string = ''
  iniciativa: number = 0
  absorcion: number = 0
  'Defensa Melee': number = 10
  'Ataque Melee': number = 0
  'Daño Melee': string = '1d6'
  'Defensa Distancia': number = 10
  'Ataque Distancia': number = 0
  'Daño Distancia': string = '1d6'
  'Puntos Vitales': number = 20
  'Control de ki': number = 0
  'Puntos de ki': number = 0
  'Puntos de caracteristica': number = 20
}

export async function run(client: Client, message: Message, args: string[]) {
  // Verificar que se haya proporcionado al menos el nombre del personaje
  if (!args.length) {
    await message.reply(help.usage)
    return
  }

  const user = await User.findOne({ where: { name: message.author.username } })
  var new_char = new base_stats()
  new_char.name = args.join(' ')

  const msgEmbed = async (
    character: base_stats,
    interaction?: AnySelectMenuInteraction
  ) => {
    const fields = Object.entries(character).map(([key, value]) => ({
      name: ' ',
      value: `**${key}**: ${value} `,
    }))

    const embed = new EmbedBuilder()
      .setTitle('Creacion de personaje')
      .setColor('Red')
      .setDescription(`Creacion del personaje **${new_char.name}**`)
      .addFields(fields)
      .setTimestamp()
      .setAuthor({
        name: message.author.username,
        iconURL:
          message.author.avatarURL() || message.author.displayAvatarURL(),
      })
      .setFooter({
        text: 'Mamaguevo Inc.',
        iconURL:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAqwjdp8e_fM1Q30pyyvGVeFjBBc5rFnsvsfAKTPIdCAQWI0m1wv80PhXfWJiwkONe79A&usqp=CAU',
      })

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('set_stats')
        .setLabel('Establecer estadísticas')
        .setStyle(1)
    )

    const save = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('save_char')
        .setLabel('Guardar estadisticas')
        .setStyle(1)
    )

    if (interaction) {
      await interaction.followUp({
        embeds: [embed],
        components: [save],
        ephemeral: true,
      })
      return
    }

    await message.channel.send({
      embeds: [embed],
      components: [row],
    })
  }

  await msgEmbed(new_char)

  const menu = new StringSelectMenuBuilder()
    .setCustomId('stats_menu')
    .setPlaceholder('Selecciona una estadística')

  const options = Object.keys(new_char)
    .filter((stat) => stat !== 'name' && stat !== 'Puntos de caracteristica')
    .map((stat, index) => {
      return new StringSelectMenuOptionBuilder()
        .setLabel(stat)
        .setDescription(`Establecer ${stat}`)
        .setValue(index.toString())
    })

  menu.setOptions(options)

  const show_menu = async (InteractionResponse:Interaction) => {
    if (
      InteractionResponse.isButton() &&
      InteractionResponse.customId === 'set_stats'
    ) {
      return InteractionResponse.reply({
        content: 'Selecciona una estadistica para establecer su valor',
        components: [
          new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu),
        ],
        ephemeral: true,
      })
        .then(async () => {
         client.removeListener(Events.InteractionCreate, show_menu)
        })
        .catch((err) => {})
    }
  }


  const set_stats = async (InteractionResponse:Interaction) => {
    if (
      InteractionResponse.isAnySelectMenu() &&
      InteractionResponse.customId === 'stats_menu'
    ) {
  
      const stat = Object.keys(new_char).filter(
        (stat) => stat !== 'name' && stat !== 'Puntos de caracteristica'
      )[parseInt(InteractionResponse.values[0])]

      await InteractionResponse.reply({
        content: `Has seleccionado ${stat}. Introduce el valor a asignar`,
        ephemeral: true,
      }).catch((err) => {})

      const filter = (m: Message) => m.author.id === InteractionResponse.user.id
      const collector = InteractionResponse.channel?.createMessageCollector({
        filter,
        max: 1,
      })
      console.log('interaccion del menu')
      collector?.on('collect', async (message) => {
        if (isNaN(Number(message.content))) {
          await InteractionResponse.followUp({
            content: 'Valor ingresado no valido.',
            ephemeral: true,
          })

          await InteractionResponse.followUp({
            components: [
              new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                menu
              ),
            ],
            ephemeral: true,
          })
          return
        } else {
          if (
            new_char['Puntos de caracteristica'] - parseInt(message.content) <
            0
          ) {
            await message.channel.send(
              `Solo tienes ${new_char['Puntos de caracteristica']} punto(s) disponible(s)`
            )
            await msgEmbed(new_char, InteractionResponse)

            await InteractionResponse.followUp({
              components: [
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                  menu
                ),
              ],
              ephemeral: true,
            })
            return
          }

          if (stat === 'Daño Melee' || stat === 'Daño Distancia') {
            new_char[stat] = calculateDmg(
              parseInt(message.content),
              calculatePoints(new_char[stat])
            )
          } else if (stat === 'Puntos Vitales' || stat === 'Puntos de ki') {
            new_char[stat] += parseInt(message.content) * 5
          } else {
            (new_char[stat] as number) += parseInt(message.content as string) 
          }

          new_char['Puntos de caracteristica'] -= parseInt(message.content)
          message.delete()

          await msgEmbed(new_char, InteractionResponse)
          if (new_char['Puntos de caracteristica'] == 0) {
            await InteractionResponse.followUp({
              content: `${stat} definida con **${message.content} pts**. No tienes mas puntos disponibles`,
              ephemeral: true,
            }).catch((err) => {})
            return
          }
          await InteractionResponse.followUp({
            content: `${stat} definida con **${message.content} pts**. Te quedan **${new_char['Puntos de caracteristica']}** puntos disponibles`,
            ephemeral: true,
          })

          if (new_char['Puntos de caracteristica'] > 0) {
            await InteractionResponse.followUp({
              components: [
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                  menu
                ),
              ],
              ephemeral: true,
            })
            return
          }
        }
      })
      // client.removeListener(Events.InteractionCreate, set_stats)
    }
  }

  const save =async (interaction:Interaction) => {
    if(interaction.isButton() && interaction.customId === 'save_char'){
      try{
        await interaction.reply({
          content:'Guardando el personaje...',
          ephemeral:true
        })

        const char = await Character.create({...new_char})
        await char.setUser(user!)
        .then(()=>{
          client.removeListener(Events.InteractionCreate, save)
        })

        await interaction.followUp({
          content:`Personaje **${char.name}** guardado con exito!`,
          ephemeral:true
        })

        return;
      }catch(err){  
        console.log(err)
      }
    }
  }

  client.on(Events.InteractionCreate, show_menu)
  client.on(Events.InteractionCreate, set_stats)
  client.on(Events.InteractionCreate, save)

}

export const help = {
  name: 'createchar',
  descripcion:
    'comando para la creacion de un personaje de forma mas intuitiva ',
  usage: '!createchar [nombre]',
}
