enum typeAttack {
  Melee = 'Melee',
  Distancia = 'Distancia',
}

enum typeSkill{
  attack = 'Attack',
  buff = 'Buffer',
  // invocate = 'Invocacion',
}

enum IgnoreStat {
  Absorcion = 'Absorcion',
  'Defensa Melee' = 'Defensa Melee',
  'Defensa a Distancia' = 'Defensa a Distancia',
  Defensa = 'Defensa',
}

enum IncrementStat {
  'Ataque Melee' = 'Ataque Melee',
  'Ataque a Distancia' = 'Ataque a Distancia',
}

enum Debuff {
  Sangrado = 'Sangrado',
  Veneno = 'Veneno',
  Conmocion = 'Conmocion',
}

interface AttackInterface {
  DañoAdicional?: {
    description: string
    bonoDmg: number
    costPj: {
      buy: number
      scaling: number
    }
  }
  ignoreStat?: {
    description: string
    ignoreStat: IgnoreStat
    bonoDecrement?: number
    costPj: {
      buy: number
      scaling: number
    }
  }
  incrementStat?: {
    description: string
    incrementStat: IncrementStat
    bonoIncrement: number
    costPj: {
      buy: number
      scaling: number
    }
  }
  debuff?: {
    description: string
    debuff: Debuff
    damageResidual: number | string
    costPj: {
      buy: number
      scaling: number
    }
  }
  stun?: {
    description: string
    stun: boolean
    costPj: {
      buy: number
    }
  }
  combo?: {
    description: string
    comboBonification: number
    nroHits: number
    costPj: {
      buy: number
      scaling: number
    }
  }
  lifeSteal?: {
    description: string
    lifeSteal: number
    costPj: {
      buy: number
      scaling: number
    }
  }
  manaSteal?: {
    description: string
    manaSteal: number
    costPj: {}
  }
}

interface BuffInterface {
  sage_mode?: {
    description: string
    // level: number
    incrementStats: number|string[]
    bonoIncrement: number
    costPj: {
      buy: number
      scaling: number
    }
    costKi: {
      activate: number
      keep_active: number
    }
  }
  cursed_brand?: {
    description: string
    incrementStats: number
    decrementStats: number
    costPj: {
      buy: number
      scaling: number
    }
    costKi: {
      activate: number
      keep_active: number
    }
  }
  life_flame?: {
    description: string
    incrementstats: number
    decrementLife: number
    costPj: {
      buy: number
      scaling: number
    }
  }
  mental_accelerator?: {
    description: string
    incrementeInit: number
    costPj: {
      buy: number
      scaling: number
    }
  }
  eyes_carmesi?: {
    description: string
    incrementeInit: number
    saving_throw: {
      nro: number
      perturns: number
    }
    costPj: {
      buy: number
      scaling: number
    }
    costKi: {
      activate: number
      keep_active: number
    }
    spectral_guardian: boolean
  }
  spectral_guardian?: {
    description: string
    state:
      | {
          increment_defense: number
          costKi: {
            active: number
            keep_active: number
          }
        }
      | {
          increment_defense: number
          increment_attack: number
          costKi: {
            active: number
            keep_active: number
          }
        }
      | {
          increment_defense: number
          increment_attack: number
          increment_damage: number
          costKi: {
            active: number
            keep_active: number
          }
        }
      | {
          incrementStats: number
          costKi: {
            active: number
            keep_active: number
          }
        }
  }
}

// export interface SkillInterface {
//   name: string
//   description: string
//   descriptionEffetcs: string
//   level: number
//   attack?: typeAttack
//   type: typeSkill
//   efects: AttackInterface | BuffInterface
// }

export {BuffInterface, AttackInterface, typeAttack, typeSkill}