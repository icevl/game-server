import { Sequelize, DataTypes, Model, Optional } from "sequelize"
import { IMatch, MatchType } from "@interfaces/matches.interface"

export type MatchCreationAttributes = Optional<IMatch, "id" | "type">

export class MatchesModel extends Model<IMatch, MatchCreationAttributes> implements IMatch {
  public id: number
  public type: MatchType
  public map_id: number
  public uuid: string
  public host: string
  public port: number

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  static associate(models) {
    this.hasMany(models.MatchesSessions, { as: "sessions", foreignKey: "match_id" })
  }
}

export default function (sequelize: Sequelize): typeof MatchesModel {
  MatchesModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      type: {
        allowNull: false,
        type: DataTypes.STRING(100)
      },
      uuid: {
        allowNull: false,
        defaultValue: "empty",
        type: DataTypes.STRING(100)
      },
      map_id: {
        allowNull: false,
        defaultValue: 0,
        type: DataTypes.INTEGER
      },
      host: {
        allowNull: false,
        defaultValue: "127.0.0.1",
        type: DataTypes.STRING(100)
      },
      port: {
        allowNull: false,
        defaultValue: 1234,
        type: DataTypes.INTEGER
      }
    },
    {
      tableName: "matches",
      indexes: [
        {
          unique: false,
          fields: ["map_id"],
          using: "BTREE"
        },
        {
          unique: true,
          fields: ["uuid"],
          using: "BTREE"
        }
      ],
      sequelize
    }
  )

  return MatchesModel
}
