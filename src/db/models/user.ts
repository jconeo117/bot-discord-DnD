import { BelongsToManyAddAssociationMixin, BelongsToManyGetAssociationsMixin, DataTypes, HasManyGetAssociationsMixin, Model } from "sequelize"
import { db } from "../db"
import { SessionInterface } from "./sessions"
import { CharacterInterface } from "./characters"


interface UserInterface extends Model {
  readonly id: number
  name: string

  addSession: BelongsToManyAddAssociationMixin<SessionInterface, number>
  getSession: BelongsToManyGetAssociationsMixin<SessionInterface>
  getCharacters:HasManyGetAssociationsMixin<CharacterInterface>
}

class User extends Model implements UserInterface {
  public id!: number
  public name!: string

  public addSession!: BelongsToManyAddAssociationMixin<SessionInterface, number>
  public getSession!: BelongsToManyGetAssociationsMixin<SessionInterface>
  public getCharacters!: HasManyGetAssociationsMixin<CharacterInterface>
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING },
  },
  {
    sequelize: db, // Instancia de Sequelize
    modelName: 'User', // Nombre del modelo
    tableName:'Users', //
  }
)

export {User, UserInterface}