enum typeAttack {
  Melee = 'Melee',
  Distancia = 'Distancia',
}

enum typeSkill {
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

interface BuffInterface {
  sage_mode?: {
    description: string
    // level: number
    incrementStats: number | string[]
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


interface buffs{
  formatDescription(description: string, bono: number,  scaling?:number, decreaseStat?:number, incrementStat?:number, active?:number, keepactive?:number): string | undefined
  buffos:{
    [key:string]:{
      description:string
      bonoIncrement?:number
      incrementStat?:{
        'iniciativa'?:number
        'Daño'?:number
        'Ataque'?:number
      }
      decreaseStat?:{
        'puntos vitales'?:number
        'absorcion'?:number
        'defensa'?:number
      }
      saving_throw?: {
        nro: number
        perturns: number
      }
      costPj:{
        buy:number
        scaling?:number
      }
      costKi:{
        active:number
        keepActive:number
      }
      spectral_guardian?: boolean
    }
  }
}


interface Attack {
  formatDescription(description: string, bono: number): string | undefined
  effects: {
    [key: string]: {
      description: string
      bono?: number
      ignoreStat?: IgnoreStat
      incrementStat?: IncrementStat
      debuff?: Debuff
      stun?: boolean
      costPj: {
        buy: number
        scaling?: number
      }
    }
  }
}

const attacks_effects: Attack = {
  formatDescription(description: string, bono?: number) {
    if (bono) {
      return description.replace('${bono}', `${bono}`)
    }
    return description
  },
  effects: {
    ['Daño adicional']: {
      description: 'inflinge **+${bono}pts** daño adicional.',
      bono: 1,
      costPj: {
        buy: 1,
        scaling: 1,
      },
    },
    absorcion: {
      description: 'ignora la absorcion del enemigo',
      ignoreStat: IgnoreStat.Absorcion,
      costPj: {
        buy: 4,
      },
    },
    'Defensa Melee': {
      description: 'ignora la defensa melee del enemigo en **-${bono}**.',
      ignoreStat: IgnoreStat['Defensa Melee'],
      bono: 2,
      costPj: {
        buy: 3,
        scaling: 1,
      },
    },
    'Defensa a distancia': {
      description: 'ignora la defensa a distancia del enemigo en **-${bono}**.',
      ignoreStat: IgnoreStat['Defensa a Distancia'],
      bono: 2,
      costPj: {
        buy: 3,
        scaling: 1,
      },
    },
    'Ataque Melee': {
      description: 'aumenta el ataque melee del jugador en **+${bono}**',
      incrementStat: IncrementStat['Ataque Melee'],
      bono: 1,
      costPj: {
        buy: 1,
        scaling: 1,
      },
    },
    'Ataque a distancia': {
      description: 'aumenta el ataque a distancia del jugador en **+${bono}**',
      incrementStat: IncrementStat['Ataque a Distancia'],
      bono: 1,
      costPj: {
        buy: 1,
        scaling: 1,
      },
    },
    sangrado: {
      description:
        'provoca sangrado en el enemigo. Causa **${bono}** de daño residual',
      bono: 3,
      debuff: Debuff.Sangrado,
      costPj: {
        buy: 2,
        scaling: 2,
      },
    },
    stun: {
      description: 'provoca aturdimiento al enemigo durante 1 turno.',
      stun: true,
      costPj: {
        buy: 4,
      },
    },
    combo: {
      description: 'por cada golpe exitoso aumenta el daño en **+${bono}**.',
      bono: 1,
      costPj: {
        buy: 2,
        scaling: 2,
      },
    },
    lifeSteal: {
      description:
        'roba **${bono}PV** del enemigo por cada 10 puntos de daño causado.',
      bono: 1,
      costPj: {
        buy: 1,
        scaling: 1,
      },
    },
    manaSteal: {
      description:
        'roba **${bono}PK** del enemigo por cada 10 puntos de daño causado.',
      bono: 1,
      costPj: {
        buy: 1,
        scaling: 1,
      },
    },
  },
}

const buffs_effects:buffs={
  formatDescription(description:string, bonoIncrement?:number, scaling?:number, decreaseStat?:number, incrementStat?:number, active?:number, keepactive?:number) {

    if(bonoIncrement){
      description = description.replace('${bonoIncrement}', `${bonoIncrement}`)
    }
    if(scaling){
      description += ` Cada **${scaling}PJ** aumenta el bonificador en +1.`
    }
    if(decreaseStat){
      description = description.replace('${decreaseStat}', `${decreaseStat}`)
    }
    if(incrementStat){
      description = description.replace('${incrementStat}', `${incrementStat}`)
    }

    description = description.replace('${active}', `${active}`)
    description = description.replace('${keepactive}', `${keepactive}`)
    return description
  },
  buffos:{
    'Modo sabio':{
      description: 'entra en modo sabio. aumenta todas las estadistica en **+${bonoIncrement}**. Activar consume **${active}PK** y mantener el modo sabio consume **${keepactive}**',
      bonoIncrement: 1,
      costPj:{
        buy:10,
        scaling:1
      },
      costKi:{
        active:5,
        keepActive:3
      }
    },
    'Marca Maldita':{
      description:'el jugador desbloquea su marca maldita. aumenta el ataque y daño (Melee y Distancia) en **+${bonoIncrement}**. reduce la defensa (Melee y Distancia) y la absorcion en **-${decreaseStat}**. Activar consume **${active}PK** y mantener el modo sabio consume **${keepactive}**',
      bonoIncrement:2,
      incrementStat: {
        Daño: 2,
        Ataque: 2
      },
      decreaseStat:{
        defensa:1,
        absorcion:1
      },
      costPj:{
        buy:4,
        scaling:1
      },
      costKi:{
        active:2,
        keepActive:1
      }
    },
    'Acelerador mental':{
      description:'el jugador puede aumentar al velocidad de su proceso mental. aumenta la iniciativa del jugador en combate en **+${incrementStat}**. Activar consume **${active}PK** y mantener el modo sabio consume **${keepactive}**',
      incrementStat:{
        iniciativa:3
      },
      costPj:{
        buy:4,
        scaling:1
      },
      costKi:{
        active:2,
        keepActive:1
      }
    }
  }
}

export { BuffInterface, typeAttack, typeSkill, Attack, attacks_effects, buffs_effects }
