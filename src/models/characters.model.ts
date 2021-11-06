import { Sequelize, DataTypes, Model, Optional } from "sequelize"
import { Character } from "@interfaces/characters.interface"
import { UserModel } from "./users.model"

export type MatchCreationAttributes = Optional<Character, "id" | "user_id" | "model">

export class CharacterModel extends Model<Character, MatchCreationAttributes> implements Character {
  public id: number
  public user_id: number
  public model: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
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

  CharacterModel.belongsTo(UserModel, {
    foreignKey: "user_id",
    as: "user"
  })

  return CharacterModel
}
