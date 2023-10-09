import { BelongsToSetAssociationMixin, DataTypes, HasManySetAssociationsMixin, Model } from "sequelize"
import { db } from "../db"
import { UserInterface } from "./user"
import { SkillInterface } from "./skills"


interface CharacterInterface extends Model {
  readonly id: number
  name?: string
  iniciativa?: number
  absorcion?: number
  'Defensa Melee'?: number
  'Ataque Melee'?: number
  'Daño Melee'?: string
  'Defensa Distancia'?: number
  'Ataque Distancia'?: number
  'Daño Distancia'?: string
  'Puntos Vitales'?: number
  'Control de ki'?: number
  'Puntos de ki'?: number
  'Puntos de caracteristica'?: number

  setUser: BelongsToSetAssociationMixin<UserInterface, number>
  setSkill: HasManySetAssociationsMixin<SkillInterface, number>
}

class Character extends Model implements CharacterInterface {
  public id!: number
  name?: string
  iniciativa?: number
  absorcion?: number
  'Defensa Melee'?: number
  'Ataque Melee'?: number
  'Daño Melee'?: string
  'Defensa Distancia'?: number
  'Ataque Distancia'?: number
  'Daño Distancia'?: string
  'Puntos Vitales'?: number
  'Control de ki'?: number
  'Puntos de ki'?: number
  'Puntos de caracteristica'?: number

  public setUser!: BelongsToSetAssociationMixin<UserInterface, number>
  public setSkill!: HasManySetAssociationsMixin<SkillInterface, number>
}

Character.init(
  {
    name: DataTypes.STRING,
    iniciativa: { type: DataTypes.INTEGER, defaultValue: 0 },
    absorcion: { type: DataTypes.INTEGER, defaultValue: 0 },
    'Defensa Melee': { type: DataTypes.INTEGER, defaultValue: 10 },
    'Ataque Melee': { type: DataTypes.INTEGER, defaultValue: 0 },
    'Daño Melee': { type: DataTypes.STRING, defaultValue: '1d6' },
    'Defensa Distancia': { type: DataTypes.INTEGER, defaultValue: 10 },
    'Ataque Distancia': { type: DataTypes.INTEGER, defaultValue: 0 },
    'Daño Distancia': { type: DataTypes.STRING, defaultValue: '1d6' },
    'Puntos Vitales': { type: DataTypes.INTEGER, defaultValue: 20 },
    'Control de ki': { type: DataTypes.INTEGER, defaultValue: 0 },
    'Puntos de ki': { type: DataTypes.INTEGER, defaultValue: 0 },
    'Puntos de caracteristica': { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    sequelize: db, // Instancia de Sequelize
    modelName: 'Character', // Nombre del modelo
    tableName:'Characters'
  }
)

export {Character, CharacterInterface}