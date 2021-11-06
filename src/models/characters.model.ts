import { Sequelize, DataTypes, Model, Optional } from "sequelize"
import { ICharacter } from "@interfaces/characters.interface"
import { UserModel } from "./users.model"

export type MatchCreationAttributes = Optional<ICharacter, "id" | "user_id" | "model">

export class CharacterModel extends Model<ICharacter, MatchCreationAttributes> implements ICharacter {
  public id: number
  public user_id: number
  public model: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  static associate(models) {
    this.hasMany(models.MatchesSessions, { as: "sessions", foreignKey: "character_id" })
  }
}

export default function (sequelize: Sequelize): typeof CharacterModel {
  CharacterModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      model: {
        allowNull: false,
        type: DataTypes.STRING(100)
      }
    },
    {
      tableName: "characters",
      sequelize
    }
  )

  return CharacterModel
}
