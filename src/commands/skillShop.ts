import {
  ActionRowBuilder,
  ButtonBuilder,
  Client,
  EmbedBuilder,
  Events,
  Interaction,
  InteractionResponse,
  Message,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from 'discord.js'
import { User } from '../db/models/user'
import { Attack, attacks_effects, typeSkill } from '../utils/skillsInterface'
import { Character } from '../db/models/characters'
import { Skill, SkillInterface } from '../db/models/skills'
import { selectType, setPJ, typeOptions } from '../utils/skill/skill.utils'

let description = ``
let skill = new Skill()

export async function run(
  client: Client,
  message: Message,
  args: string[],
  command: string
) {
  const user = await User.findOne({ where: { name: message.author.username } })
  const emojis = ['-2', '-1', '+1', '+2']

  const characters = await user?.getCharacters()
  let char: Character
  let skill_type: string
  let msg: InteractionResponse | Message | undefined
  let bonification: number
  let nameSkill: string
  let pointsPj: number
  let pointsJutsu: any, level: any
  let skillPjCost: number
  var effect: any
  let habilitie: { [key: string]: { costBuy: number; costScaling?: number } } =
    {}

  if (!characters![0]) {
    await message.channel.send('No tienes personajes para crear habilidades')
    return
  }

  const menu = new StringSelectMenuBuilder()
    .setCustomId('select_char')
    .setPlaceholder('Selecciona el personaje')

  const options = characters?.map((character, index) => {
    return new StringSelectMenuOptionBuilder()
      .setLabel(character.name!)
      .setValue(index.toString())
  })

  menu.setOptions(options!)
  const embed = new EmbedBuilder()

  await message.channel.send({
    content: 'Selecciona el personaje para crear la habilidad',
    components: [
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu),
    ],
  })

  const set_char = async (interaction: Interaction) => {
    if (
      interaction.isAnySelectMenu() &&
      interaction.customId === 'select_char'
    ) {
      char = characters![parseInt(interaction.values[0])]

      if ((char['Puntos de caracteristica'] as number) >= 1) {
        await interaction.reply(
          `Personaje seleccionado **${char.name}**. El personaje tiene **${char['Puntos de caracteristica']}PC** disponibles`
        )
        await interaction.followUp(
          'Ingrese la cantidad de puntos de característica a asignar'
        )
      } else {
        interaction.reply({
          content: "El personaje seleccionado no tiene **PC's** disponibles",
          components: [
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu),
          ],
        })
        return
      }

      let filter = (m: Message) => {
        if (m.author.id === interaction.user.id) {
          if (!isNaN(Number(m.content))) {
            pointsPj = Number(m.content)
            return true
          } else {
            // collector.stop()
            m.reply('Valor ingresado no valido. Por favor ingresa otro valor')
          }
        }
        return false
      }

      const collector = message.channel.createMessageCollector({
        filter,
        time: 15000,
      })

      collector.on('collect', async (m: Message) => {
        if (!isNaN(Number(m.content))) {
          if (char['Puntos de caracteristica']! - Number(m.content) >= 0)
            pointsPj = Number(m.content)
          char['Puntos de caracteristica']! -= pointsPj
          let reply = setPJ(pointsPj)
          pointsJutsu = reply.pointsJutsu
          level = reply.nivel

          await interaction.followUp(
            `puntos de Jutsu para asignar ${pointsJutsu}. Al personaje **${char.name}** le quedan **${char['Puntos de caracteristica']}PC**`
          )
        }

        menu
          .setCustomId('select_type')
          .setPlaceholder('Selecciona el tipo de habilidad')
          .setOptions(
            new StringSelectMenuOptionBuilder()
              .setLabel('Ataque')
              .setValue('Ataque'),
            new StringSelectMenuOptionBuilder()
              .setLabel('Potenciador')
              .setValue('Potenciador')
          )

        await interaction.followUp({
          content: 'Selecciona el tipo de habilidad',
          components: [
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu),
          ],
        })
      })

      return
    } else if (
      (interaction.isAnySelectMenu() &&
        interaction.customId === 'select_type') ||
      (interaction.isButton() && interaction.customId === 'canceled')
    ) {
      if (interaction.isAnySelectMenu()) {
        skill_type = interaction.values[0]
      }

      embed
        .setTitle('Tienda de efectos')
        .setDescription(
          `# Efectos para las habilidades de tipo ${skill_type}\n\n # Personaje: **${char.name}** \n`
        )

      menu.setCustomId('skill_effects').setPlaceholder('Selecciona el efecto')

      //opciones del menu dependiendo del tipo de skill.
      menu.setOptions(typeOptions(skill_type))
      //campos del embed dependiendo del tipo de skill.
      embed.addFields(selectType(skill_type))

      await interaction.reply({
        embeds: [embed],
        components: [
          new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu),
        ],
      })

      return
    } else if (
      interaction.isAnySelectMenu() &&
      interaction.customId === 'skill_effects'
    ) {
      ;[effect] = Object.entries(attacks_effects.effects).filter(
        (efect) => efect[0] === interaction.values[0]
      )
      ;(habilitie[effect[0]] = habilitie[effect[0]] || {}).costBuy =
        effect[1].costPj.buy

      if (!skill.efects.hasOwnProperty(effect[0])) {
        skillPjCost = Object.values(habilitie).reduce((pts, hability) => {
          pts += hability.costBuy + (hability.costScaling || 0)
          return pts
        }, 0)
        if (skillPjCost <= pointsJutsu) {
          description += `${
            attacks_effects.formatDescription(
              effect[1].description,
              effect[1].bono!
            ) as string
          } `
          skill.addEffect(effect[0], effect[1])
        } else {
          message.channel
            .send('**No tienes suficientes puntos disponibles**')
            .then((message) => {
              setTimeout(() => {
                message.delete()
              }, 2500)
            })
        }
      }

      const buttons = emojis.map((num) => {
        return new ButtonBuilder().setLabel(num).setCustomId(num).setStyle(2)
      })

      buttons.push(
        new ButtonBuilder()
          .setLabel('guardar')
          .setCustomId('guardar')
          .setStyle(1)
      )

      if (!msg) {
        interaction.deferUpdate()
        msg = await message.channel.send({
          content: `${description} (**${pointsJutsu - skillPjCost}PJ**)`,
          components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(...buttons),
          ],
        })
      } else {
        interaction.deferUpdate()
        await msg.edit({
          content: `${description} (**${pointsJutsu - skillPjCost}PJ**)`,
          components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(...buttons),
          ],
        })
      }

      return
    } else if (interaction.isButton() && interaction.customId != 'guardar') {
      bonification = parseInt(interaction.customId)
      let base = attacks_effects.formatDescription(
        effect[1].description as string,
        effect[1].bono!
      )

      if (effect[1].bono) {
        if (effect[1].bono + bonification >= 1) {
          effect[1].bono += bonification
          habilitie[effect[0]].costScaling =
            (effect[1].bono - 1) * effect[1].costPj.scaling
        }
      }

      skillPjCost = Object.values(habilitie).reduce((pts, hability) => {
        pts += hability.costBuy + (hability.costScaling || 0)
        return pts
      }, 0)

      if (skillPjCost > pointsJutsu) {
        message.channel
          .send('**No tienes suficientes puntos disponibles**')
          .then((message) => {
            setTimeout(() => {
              message.delete()
            }, 2500)
          })
        effect[1].bono -= bonification
        habilitie[effect[0]].costScaling =
          (effect[1].bono - 1) * effect[1].costPj.scaling
      }

      console.log('costo final del escalado', habilitie)
      console.log('total de PJ -->', skillPjCost)

      let bonus = attacks_effects.formatDescription(
        effect[1].description,
        effect[1].bono!
      )

      description = description.replace(base!, bonus as string)

      msg?.edit({
        content: `${description} (**${pointsJutsu - skillPjCost}PJ**)`,
      })

      interaction.deferUpdate()

      return
    } else if (interaction.isButton() && interaction.customId === 'guardar') {
      interaction.reply('Antes de guardar la habilidad, otorgale un nombre.')

      skill.level = level

      const filter = (m: Message) => m.author.id === interaction.user.id
      const collector = interaction.channel?.createMessageCollector({
        filter,
        max: 1,
      })

      collector?.on('collect', async (message) => {
        nameSkill = message.content

        let buttons = []

        buttons.push(
          new ButtonBuilder()
            .setLabel('✅')
            .setStyle(2)
            .setCustomId('confirmation')
        )

        buttons.push(
          new ButtonBuilder().setLabel('❌').setStyle(2).setCustomId('canceled')
        )

        interaction.followUp({
          content: `¿Quieres guardar la habilidad con el nombre: **${message.content}**?`,
          components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(...buttons),
          ],
        })

        msg = undefined

        return
      })

      console.log(skill)

      return
    }
    client.removeListener(Events.InteractionCreate, set_char)
  }

  client.on(Events.InteractionCreate, set_char)
}

export const help = {
  name: 'shop-skill',
  descricion: 'comando para comprar crear/comprar habilidades/invocaciones',
  usage: '!shop-skill',
}
