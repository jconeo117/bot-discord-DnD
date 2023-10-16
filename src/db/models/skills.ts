import { BelongsToSetAssociationMixin, DataTypes, Model } from 'sequelize'
import { db } from '../db'
import {
  typeAttack,
  typeSkill,
  Attack,
  BuffInterface,
} from '../../utils/skillsInterface'
import { CharacterInterface } from './characters'


interface SkillInterface extends Model {
  readonly id: number,
  name: string
  description: string
  descriptionEffetcs: string
  level: number
  attack?: typeAttack
  skilltype: typeSkill
  efects: Attack['effects'] | BuffInterface

  setCharacter: BelongsToSetAssociationMixin<CharacterInterface,number>
}

class Skill extends Model implements SkillInterface{
  readonly id!: number;
  name!: string;
  description!: string;
  descriptionEffetcs!: string;
  level!: number;
  attack?: typeAttack;
  skilltype!: typeSkill;
  efects: Attack['effects'] | BuffInterface = {}

  addEffect(name: string, effect: Attack['effects'][string]) {
    (this.efects as any)[name] = effect;
  }
  
  public setCharacter!: BelongsToSetAssociationMixin<CharacterInterface,number>
}

Skill.init({
  name:{type: DataTypes.STRING, defaultValue:''},
  description:{type: DataTypes.STRING, defaultValue:''},
  descriptionEffetcs:{type: DataTypes.STRING, defaultValue:''},
  level: {type: DataTypes.INTEGER, defaultValue:1},
  attack:{type: DataTypes.ENUM('attack', 'buffer', 'invocate'), allowNull:true},
  skilltype:{type: DataTypes.STRING, allowNull:true},
  efects:{type: DataTypes.JSON, allowNull:true}

},
{
  sequelize:db,
  modelName:'Skill',
  tableName:'Skills'
})

export {SkillInterface, Skill}