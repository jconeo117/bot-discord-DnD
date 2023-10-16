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
import { Attack, effects_info, typeSkill } from '../utils/skillsInterface'
import { Character } from '../db/models/characters'
import { Skill, SkillInterface } from '../db/models/skills'

let description = ``
let skill = new Skill()

export async function run(
  client: Client,
  message: Message,
  args: string[],
  command: string
) {
  const user = await User.findOne({ where: { name: message.author.username } })
  const emojis = ['1', '2', '3', '4', '5']

  const characters = await user?.getCharacters()
  let char: Character
  let skill_type: string
  let msg: InteractionResponse | Message
  var effect: any

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
      // char = await set_character(interaction, menu, char, characters!) as Character

      char = characters![parseInt(interaction.values[0])]

      await interaction.reply(`Personaje seleccionado **${char.name}**`)

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

      return
    } else if (
      interaction.isAnySelectMenu() &&
      interaction.customId === 'select_type'
    ) {
      skill_type = interaction.values[0]

      embed
        .setTitle('Tienda de efectos')
        .setDescription(
          `# Efectos para las habilidades de tipo ${skill_type}\n\n # Personaje: **${char.name}** \n`
        )

      menu.setCustomId('skill_effects').setPlaceholder('Selecciona el efecto')

      const skill_opts = Object.entries(effects_info.effects).map(
        ([key, effect]) => {
          return new StringSelectMenuOptionBuilder().setLabel(key).setValue(key)
        }
      )

      const fields = Object.entries(effects_info.effects).map(
        ([key, effect]) => ({
          name: `${key} (**${effect.costPj.buy}PJ**)`,
          value: `${effects_info.formatDescription(
            effect.description,
            effect.bono!
          )} ${
            effect.bono
              ? `Cada **${effect.costPj.scaling}PJ** aumenta el bono`
              : ''
          }`,
        })
      )

      menu.setOptions(skill_opts)
      embed.addFields(fields)

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
      ;[effect] = Object.entries(effects_info.effects).filter(
        (efect) => efect[0] === interaction.values[0]
      )

      if (!skill.efects.hasOwnProperty(effect[0])) {
        description += `${
          effects_info.formatDescription(
            effect[1].description,
            effect[1].bono!
          ) as string
        } `
      }

      skill.addEffect(effect[0], effect[1])

      const buttons = emojis.map((num) => {
        return new ButtonBuilder().setLabel(num).setCustomId(num).setStyle(2)
      })

      if (!msg) {
        msg = await interaction.reply({
          content: description,
          components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(...buttons),
          ],
        })
      } else {
        interaction.deferUpdate()
        msg = await msg.edit({
          content: description,
          components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(...buttons),
          ],
        })
      }

      return
    } else if (interaction.isButton()) {
      let level = interaction.customId

      let base = effects_info.formatDescription(
        effect[1].description as string,
        effect[1].bono!
      )

      if (effect[1].bono) {
        effect[1].bono = effect[1].costPj?.scaling! * Number(level)
      }

      let bonus = effects_info.formatDescription(
        effect[1].description,
        effect[1].bono!
      )

      description = description.replace(base!, bonus as string)

      msg.edit({
        content: description,
      })

      interaction.deferUpdate()

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
