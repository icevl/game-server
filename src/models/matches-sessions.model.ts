import { Sequelize, DataTypes, Model, Optional } from "sequelize"
import { IMatchSession } from "@interfaces/matches-sessions.interface"

export type MatchCreationAttributes = Optional<IMatchSession, "id" | "match_id" | "character_id">

export class MatchesSessionsModel extends Model<IMatchSession, MatchCreationAttributes> implements IMatchSession {
  public id: number
  public match_id: number
  public character_id: number
  public side: string
  public is_master: boolean

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  static associate(models) {
    this.belongsTo(models.Characters, { foreignKey: "character_id", as: "character" })
    this.belongsTo(models.Matches, { foreignKey: "match_id", as: "match" })
  }
}

export default function (sequelize: Sequelize): typeof MatchesSessionsModel {
  MatchesSessionsModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      match_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      character_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      side: {
        allowNull: false,
        defaultValue: "a",
        type: DataTypes.STRING(1)
      },
      is_master: {
        allowNull: true,
        defaultValue: 0,
        type: DataTypes.INTEGER
      }
    },
    {
      tableName: "matches_sessions",
      indexes: [
        {
          unique: false,
          fields: ["character_id", "match_id"],
          using: "BTREE"
        }
      ],
      sequelize
    }
  )

  return MatchesSessionsModel
}
