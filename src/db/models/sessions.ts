import { BelongsToManyAddAssociationMixin, BelongsToManyGetAssociationsMixin, BelongsToManySetAssociationsMixin, BelongsToSetAssociationMixin, DataTypes, Model } from "sequelize"
import { UserInterface } from "./user"
import { CharacterInterface } from "./characters"
import { db } from "../db"



interface SessionInterface extends Model {
  readonly id: number
  name: string
  isStarted: boolean
  isFinished: boolean

  addPlayers: BelongsToManyAddAssociationMixin<UserInterface, number>
  addCharacters: BelongsToManyAddAssociationMixin<CharacterInterface, number>
  setPlayers: BelongsToManySetAssociationsMixin<UserInterface, number>
  setCharacters: BelongsToManySetAssociationsMixin<CharacterInterface, number>
  hasPlayer: BelongsToManyGetAssociationsMixin<UserInterface>
  setGameMaster: BelongsToSetAssociationMixin<UserInterface,number>
}

class Session extends Model implements SessionInterface {
  public id!: number
  public name!: string
  public isStarted!: boolean
  public isFinished!: boolean

  public addPlayers!: BelongsToManyAddAssociationMixin<UserInterface, number>
  public addCharacters!: BelongsToManyAddAssociationMixin<
    CharacterInterface,
    number
  >
  public setPlayers!: BelongsToManySetAssociationsMixin<UserInterface, number>
  public setCharacters!: BelongsToManySetAssociationsMixin<
    CharacterInterface,
    number
  >
  public hasPlayer!: BelongsToManyGetAssociationsMixin<UserInterface>
  public setGameMaster!: BelongsToSetAssociationMixin<UserInterface, number>
}

Session.init(
  {
    name: DataTypes.STRING,
    isStarted: { type: DataTypes.BOOLEAN, defaultValue: false },
    isFinished: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    sequelize: db,
    modelName: 'Session',
    tableName:'Sessions',
  }
)

export {Session, SessionInterface}