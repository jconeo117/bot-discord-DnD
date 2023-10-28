import { StringSelectMenuOptionBuilder } from 'discord.js'
import { attacks_effects, buffs_effects } from '../skillsInterface'

export const setPJ = (PointsChar: number) => {
  if (PointsChar <= 0) {
    return { pointsJutsu: 0, nivel: 0 }
  } else if (PointsChar == 1) {
    return { pointsJutsu: 6, nivel: 1 }
  } else {
    let nivel = 1
    let pointsJutsu = 6
    while (PointsChar > nivel) {
      nivel += 1
      pointsJutsu += 3
    }
    return { pointsJutsu, nivel }
  }
}

export const selectType = (type: string) => {
  let fields: { name: string; value: string }[] = []

  if (type === 'Ataque') {
    fields = Object.entries(attacks_effects.effects).map(([key, effect]) => ({
      name: `${key} (**${effect.costPj.buy}PJ**)`,
      value: `${attacks_effects.formatDescription(
        effect.description,
        effect.bono!
      )} ${
        effect.bono ? `Cada **${effect.costPj.scaling}PJ** aumenta el bono` : ''
      }`,
    }))
  } else if (type === 'Potenciador') {
    fields = Object.entries(buffs_effects.buffos).map(([key, effect]) => ({
      name: `${key} (**${effect.costPj.buy}PJ**)`,
      value: `${buffs_effects.formatDescription(
        effect.description,
        effect.bonoIncrement!,
        effect.costPj.scaling,
        effect.decreaseStat?.defensa,
        effect.incrementStat?.iniciativa,
        effect.costKi.active,
        effect.costKi.keepActive
      )}`,
    }))
  }

  return fields
}

export const typeOptions = (type: string) => {

  let skill_opts:StringSelectMenuOptionBuilder[] = []

  if (type === 'Ataqie') {
    skill_opts = Object.entries(attacks_effects.effects).map(([key, effect]) => {
      return new StringSelectMenuOptionBuilder().setLabel(key).setValue(key)
    })
  } else if (type === 'Potenciador') {
    skill_opts = Object.entries(buffs_effects.buffos).map(([key, effect]) => {
      return new StringSelectMenuOptionBuilder().setLabel(key).setValue(key)
    })
  }

  return skill_opts
}
